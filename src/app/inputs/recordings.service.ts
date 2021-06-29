import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { map } from 'rxjs/operators';
import { isEmpty, orderBy } from "lodash-es";

import { Recording } from "../shared/recording.model";
import { environment } from "src/environments/environment.base";

import { SerialisePipe } from "../shared/serialise.pipe";
import { IoService } from "../core/io.service";
import { FuzzyService } from "../core/fuzzy.interface";

const DATA_FOLDER = environment.dataFolder;
const DEFAULT_SORT = environment.defaultSort;

@Injectable()
export class RecordingsService {

  // This actually represents the server-side collection of recordings. Hence its being private.
  private collection: Recording[] | null;

  constructor(
    private ioService: IoService,
    private fuzzyService: FuzzyService,
    private serialise: SerialisePipe
  ) {
    this.collection = null;
  }

  /**
   * Fetches and converts the server-side file holding all the recordings into individual recordings.
   * @param filename - Name of server-side file under the default data folder.
   * @param sortOptions - By default, it sorts the recordings alphabetically.
   * @returns Observable with the new collection of recordings.
   */
  load (filename: string, sortOptions: any = DEFAULT_SORT): Observable<Recording[]> {
    return this.ioService.fetch(DATA_FOLDER + filename).pipe(
      map((response: string) => {
        const parsed = this.ioService.parse(response);

        if (isEmpty(sortOptions)) {
          return parsed;
        }

        // With a remote API, the sorting here would likely have been done on the server-side.
        this.collection = parsed;
        return orderBy(parsed, sortOptions);
      })
    );
  }

  /**
   * Checks if a given recording's ISRC is already in use by other recordings in the collection.
   * Effectively, it tests the ideal uniquess of the recording provided.
   * @param recording - Recording to look for.
   * @returns Observable with true if a recording with the same ISRC is found. False if not there,
   * was not provided in the first place or has no ISRC.
   */
  hasRecording(recording: Recording | undefined): Observable<boolean> {
    try {
      if (!this.collection || !recording || isEmpty(recording) || !recording.isrc) {
        return of(false);
      }
      
      return of(this.collection.some(item => item.isrc === recording.isrc));

      } catch(error) {
        return throwError(error);
      }
  }
  
  /**
   * Performs a fuzzy search on a set of recordings either with a serialised string version of a given 
   * recording or a plain string. After that, the recordings' order is re-balanced in terms of their
   * durations. This is mainly due to the numeric nature of the duration, which does not lend itself 
   * to distance-based fuzzy algorithms.
   * @param query - String or recording used as fuzzy query.
   * @returns Observable with collection of recordings.
   */
  fuzzySearch(query: Recording | string): Observable<Recording[]> {
    const searchKeys = this.fuzzyService.searchKeys;
    let recordings;

    try {
      if (!this.collection) {
        return of([]);
      }

      if (typeof query === 'string') {
        recordings = this.fuzzyService.search(this.collection, query);
      
      // Recording passed in => serialises only values for keys in fuzzy options and re-balances by duration
      } else {
        recordings = this.fuzzyService.search(this.collection, this.serialise.transform(query, searchKeys));
        if (searchKeys.indexOf('duration') === -1) {
          recordings = this.fuzzyService.sortDurationDiff(recordings, query.duration);
        }
      }

      return of(recordings.map(result => result.item));

    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Adds a new recording to an existing collection without modifying it.
   * @param recording - New item to add.
   * @returns Observable with new collection of recordings. The original collection is returned back
   * if an empty or no recording is passed in.
   */
   add(recording: Recording | undefined): Observable<Recording[]> {
    try {
      if (!this.collection) {
        throw new Error('Can\'t add to a non-existent collection');
      }

      if (!recording || isEmpty(recording)) {
        return of(this.collection);
      }

      // Again, mimicking the server's behaviour regarding sorting.
      this.collection = [...this.collection, recording];
      return of(orderBy(this.collection, DEFAULT_SORT));
    
    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Removes all recordings that have the same serialised data as a given one.
   * @param recording - Object representative of the recording to be removed.
   * @returns Observable with new collection of recordings. The original collection is returned back
   * if an empty or no recording is passed in.
   */
  remove(recording: Recording | undefined): Observable<Recording[]> {
    try {
      if (!this.collection) {
        throw new Error('Can\'t remove from a non-existent collection');
      }
      
      if (!recording || isEmpty(recording)) {
        return of(this.collection);
      }

      this.collection = this.collection.filter(item => {
        return this.serialise.transform(item) !== this.serialise.transform(recording);
      });
      return of(this.collection);

    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Sorts all recordings by field(s) and a specific order.
   * @param sortBy - List of recording field names whose values will determine the sorting.
   * @param order - Ascending or descending direction.
   * @returns Observable with new collection of recordings.
   */
  sort(
    sortBy: string[] = DEFAULT_SORT, 
    order: ('asc' | 'desc')[] = []
  ): Observable<Recording[]> {
    try {
      if (!this.collection) {
        throw new Error('Can\'t sort a non-existent collection');
      }

      this.collection = orderBy(this.collection, sortBy, order);
      return of(this.collection);

    } catch(error) {
      return throwError(error);
    }
  }
}