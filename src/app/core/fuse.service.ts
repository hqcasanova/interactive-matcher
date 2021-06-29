import { Injectable } from "@angular/core";
import { orderBy } from "lodash-es";

import Fuse from 'fuse.js';

import { Recording } from "../shared/recording.model";
import { environment } from "src/environments/environment";
import { FuzzyService } from "./fuzzy.interface";

const DEFAULT_FUSE = environment.defaultFuse;

/**
 * Emulates a server-side fuzzy search endpoint. All underlying details like the plugin used for
 * the search (ie fuse.js) are beyond the client's control and therefore are architected in a no-frills
 * way (eg: dynamic object creation of fuse.js is not segregated so as to allow seamless replacement and
 * follow dependency inversion).
 */
 @Injectable({
  providedIn: 'root'
})
export class FuseService implements FuzzyService {

  // Names of properties used for any fuzzy search ordered by weight
  readonly searchKeys: string[];

  constructor() {
    const keysByWeight = orderBy(DEFAULT_FUSE.keys, 'weight', 'desc');
    this.searchKeys = keysByWeight.map(keyProps => keyProps.name);
  }

  /**
   * Fuzzy searches for a string using Levenshtein distances.
   * @param collection Original collection to search on.
   * @param query - String used as fuzzy query.
   * @param options - Options object for the fuzzy search.
   * @returns New collection of recordings or existing collection if empty query passed.
   * By default, fuzzy results items are nested under an "item" property
   */
  search(
    collection: Recording[], 
    query: string, 
    options: any = DEFAULT_FUSE
  ): any[] {
    const fuse = new Fuse(collection, {...options, includeScore: true});

    if (query.length) {
      return fuse.search(query);
    } else {
      return collection;
    }
  }

  /**
   * Bubbles up fuzzy results by sorting in ascending "duration distance" from the 
   * reference recording's duration. Bubbling only takes place if the scores are roughly similar or 
   * if the reference recording has no duration, setting it to zero by default. If a database
   * recording has no duration either and comes on top after the fuzzy search, it makes it equal to the 
   * reference's duration + 1 so that only a recording with a very similar duration can replace it at the top.
   * Note that fuzzy scores are based on Levenshtein distances: the lower the figure, the higher the score 
   * really.
   * @param collection - Results from fuzzy search with scores.
   * @param duration - Reference recording's original duration.
   * @param bubbleCutoff - Threshold difference between scores beyond which recordings are deemed too 
   * distinct for re-sorting (their position already reflects their relevance correctly).
   * @returns New collection of duration-balanced results with orignal durations intact.
   */
  sortDurationDiff(
    collection: Fuse.FuseResult<Recording>[], 
    duration: string,
    bubbleCutoff: number = DEFAULT_FUSE.bubbleCutoff
  ): Fuse.FuseResult<Recording>[] {
    const recDuration = parseInt(duration || '0');
    let cloneDiff;
    
    // Clones the original results while converting durations to integers and calculating their differences.
    cloneDiff = collection.map((result, i) => {
      const defaultDur = i === 0 ? recDuration + 1 : 0;
      const iDuration = parseInt(result.item.duration || defaultDur.toString());
      const durationDiff = Math.abs(iDuration - recDuration);

      // Scores are rounded to avoid treating negligible score differences as meaningful.
      return Object.assign({}, result, {
        diff: durationDiff,
        score: result.score ? Math.round((result.score + Number.EPSILON) * 100) / 100 : 0
      });
    });

    // Bubbles up durations similar to the reference recording's whenever scores are also similar. 
    return cloneDiff.sort((a, b) => {
      if (Math.abs(a.score - b.score) < bubbleCutoff) {
        return a.diff - b.diff;
      } else {
        return 0;
      }
    });
  }
}