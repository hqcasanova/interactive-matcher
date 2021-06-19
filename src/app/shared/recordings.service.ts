import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Papa } from 'ngx-papaparse';
import { isEmpty, orderBy, pick } from 'lodash-es';
import Fuse from 'fuse.js';

import { Recording } from './recording.model';
import { environment } from "src/environments/environment";

const DEFAULT_FETCH = environment.defaultFetch;
const DEFAULT_SORT = environment.defaultSort;
const DEFAULT_FUZZY = environment.defaultFuzzy;

@Injectable({
  providedIn: 'root'
})
export class RecordingsService {
  constructor(
    private http: HttpClient,
    private csvParser: Papa
  ) {
  }

  /**
   * Retrieves server-side data and parses it into a collection of recordings, preserving the 
   * observable resulting from the request. The field delimiter is auto-detected and data sorted
   * alphabetically.
   * @param url - Path to the data.
   * @param options - Settings for the CSV parser.
   * @returns Observable with new collection of recordings.
   */
  fetch(url: string, options: any = DEFAULT_FETCH): Observable<Recording[]> {
    return this.http.get(url, {responseType: 'text'})
    .pipe(map((response: string) => {
      const parsed = this.csvParser.parse(response, options);

      // With a remote API, the sorting here would likely have been done on the server-side.
      return orderBy(parsed.data, DEFAULT_SORT);
    }));
  }

  /**
   * Adds a new recording to an existing collection without modifying it.
   * @param collection - Original recordings collection.
   * @param recording - New item to add.
   * @returns Observable with new collection of recordings. The original collection is returned back
   * if an empty or no recording is passed in.
   */
  add(collection: Recording[], recording: Recording | undefined): Observable<Recording[]> {
    let newCollection;

    try {
      if (!recording || isEmpty(recording)) {
        return of(collection);
      }

      newCollection = [...collection, recording];

      // Again, mimicking the server's behaviour regarding sorting.
      return of(orderBy(newCollection, DEFAULT_SORT));
    
    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Removes all recordings that have the same serialised data as a given one.
   * @param collection - Original collection to remove items from.
   * @param recording - Object representative of the recording to be removed.
   * @returns Observable with new collection of recordings. The original collection is returned back
   * if an empty or no recording is passed in.
   */
  remove(collection: Recording[], recording: Recording | undefined): Observable<Recording[]> {
    try {
      if (!recording || isEmpty(recording)) {
        return of(collection);
      }

      return of(collection.filter(item => this.serialise(item) !== this.serialise(recording)));
    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Sorts all recordings by field(s) and a specific order.
   * @param collection - Original collection to sort.
   * @param sortBy - List of recording field names whose values will determine the sorting.
   * @param order - Ascending or descending direction.
   * @returns Observable with new collection of recordings.
   */
  sort(
    collection: Recording[], 
    sortBy: string[] = DEFAULT_SORT, 
    order: ('asc' | 'desc')[] = []
  ): Observable<Recording[]> {
    try {
      return of(orderBy(collection, sortBy, order));
    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Converts the keys in the fuzzy search configuration options into their respective names or
   * a serialised version using commas and a given conjunction (as in a human-readable list). In
   * both cases, keys are listed by descending weight order.
   * @param [lastConjunction = ''] - Conjunction to be used in the human-readable version. If none
   * given, the serialisation is skipped.
   * @param toUppercase - Array of key names that should be converted to all uppercase.
   * @returns An ennumeration list of key names or an array thereof.
   */
   fuzzyKeys(lastConjunction: string = '', toUppercase: string[] = ['']): string[] | string {
    const keysByWeight = orderBy(DEFAULT_FUZZY.keys, 'weight', 'desc');
    const keyArray = keysByWeight.map(keyProps => {
      if (toUppercase.indexOf(keyProps.name) > -1) {
        return keyProps.name.toUpperCase();
      } else {
        return keyProps.name;
      }
    });

    // Adds the conjunction only at the end
    if (lastConjunction) {
      return keyArray.reduce((a, b, i, array) => {
        return a + (i < array.length - 1 ? ', ' : lastConjunction) + b;
      });
    }

    return keyArray;
  }

  /**
   * Performs a fuzzy search on a set of recordings either with a serialised string version of a given 
   * recording or a plain string. After that, the recordings' order is re-balanced in terms of their
   * durations. This is mainly due to the numeric nature of the duration, which does not lend itself to
   * distance-based fuzzy algorithms.
   * @param collection Original collection to search on.
   * @param query - Recording or string used as fuzzy query.
   * @param options - Options object for the fuzzy search.
   * @returns Observable with new collection of recordings or existing collection if empty query passed.
   */
  fuzzySearch(
    collection: Recording[], 
    query: Recording | string, 
    options: any = DEFAULT_FUZZY
  ): Observable<Recording[]> {
    try {
      const fuse = new Fuse(collection, {...options, includeScore: true});
      let recordings;

      // Query passed in directly => leaves collection intact if empty string
      if (typeof query === 'string') {
        if (query.length) {
          recordings = fuse.search(query);
        } else {
          return of(collection);
        }

      // Recording passed in => serialises only values for keys in fuzzy options and re-balances by duration
      } else {
        const fuzzyKeys = this.fuzzyKeys() as string[];

        recordings = fuse.search(this.serialise(query, fuzzyKeys));
        if (fuzzyKeys.indexOf('duration') === -1) {
          recordings = this.sortDurationDiff(recordings, query.duration);
        }
      }
     
      // By default, fuzzy results items are nested under an "item" property
      recordings = recordings.map(result => result.item);
      return of(recordings);

    } catch(error) {
      return throwError(error);
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
   * @returns New collection of duration-balanced results with orignal durations intact.
   */
  private sortDurationDiff(
    collection: Fuse.FuseResult<Recording>[], 
    duration: string
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
      if (Math.abs(a.score - b.score) < 0.16) {
        return a.diff - b.diff;
      } else {
        return 0;
      }
    });
  }

  hasRecording(collection: Recording[], recording: Recording | undefined): Observable<boolean> {
    try {
      if (!recording || isEmpty(recording) || !recording.isrc) {
        return of(false);
      }
      
      return of(collection.some(item => item.isrc === recording.isrc));

      } catch(error) {
        return throwError(error);
      }
  }

  /**
   * Convenience method to turn a given recording into a string of all its property values.
   * @param recording - Object representative of the recording.
   * @param properties - Those whose values are to be included in the recording's serialised version.
   * @returns String of property values. If an empty or no recording is passed in, an empty
   * string is returned.
   */
  serialise(
    recording: Recording | undefined, 
    properties: string[] = ['title', 'artist', 'isrc', 'duration']
  ): string {
    if (!recording || isEmpty(recording)) {
      return '';
    } else {
      return Object.values(pick(recording, properties)).join(' ');
    }
  }
}