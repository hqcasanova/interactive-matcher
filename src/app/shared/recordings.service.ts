import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Papa } from 'ngx-papaparse';
import { orderBy } from 'lodash-es';
import { pick } from 'lodash-es';

import { Recording } from './recording.model';
import { environment } from "src/environments/environment";

const CSV_HEADER: boolean = environment.csvHeader;
const DEFAULT_SORT: string[] = environment.defaultSort;

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
   * @returns Observable with collection of recordings.
   */
  fetch(url: string): Observable<Recording[]> {
    return this.http.get(url, {responseType: 'text'})
    .pipe(map((response: string) => {
      const parsed = this.csvParser.parse(response, {header: CSV_HEADER, skipEmptyLines: true});

      // With a remote API, the sorting here would likely have been done on the server-side.
      return orderBy(parsed.data, DEFAULT_SORT);
    }));
  }

  add(collection: Recording[], recording: Recording): Observable<Recording[]> {
    let newCollection;
    try {
      newCollection = [...collection, recording];

      // Again, mimicking the server's behaviour regarding sorting.
      return of(orderBy(newCollection, DEFAULT_SORT));
    } catch(error) {
      return throwError(error);
    }
  }

  remove(collection: Recording[], recording: Recording): Observable<Recording[]> {
    try {
      return of(collection.filter(item => item.isrc !== recording.isrc));
    } catch(error) {
      return throwError(error);
    }
  }

  sort(collection: Recording[], sortBy: string[] = DEFAULT_SORT, order: ('asc' | 'desc')[] = []): Observable<Recording[]> {
    try {
      return of(orderBy(collection, sortBy, order));
    } catch(error) {
      return throwError(error);
    }
  }

  /**
   * Turns the recording into a string of all its property values.
   * @param recording - Object representative of the recording.
   * @returns String of property values.
   */
  serialise(recording: Recording): string {
    const withoutDuration = pick(recording, environment.defaultFuzzy.keys);
    return Object.values(withoutDuration).join(' ');
  }
}