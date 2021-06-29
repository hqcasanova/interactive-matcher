import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable} from 'rxjs';

import { Papa } from 'ngx-papaparse';

import { environment } from "src/environments/environment";

const DEFAULT_FETCH = environment.defaultFetch;
const DEFAULT_PARSE = environment.defaultParse;

@Injectable({
  providedIn: 'root'
})
export class IoService {
  constructor(
    private http: HttpClient,
    private csvParser: Papa
  ) {
  }

  /**
   * Retrieves server-side data, preserving the observable resulting from the request. 
   * @param url - Path to the data.
   * @param options - By default, the response is expected to be plain text.
   * @returns Observable response.
   */
  fetch(url: string, options: any = DEFAULT_FETCH): Observable<any> {
    return this.http.get(url, options);
  }

  /**
   * Converts each entry in the raw data into a recording.
   * @param data - Multi-line string where each line represents a recording.
   * @param options - By default, the field delimiter is auto-detected and field names inferred.
   * @returns New collection of recordings.
   */
  parse(data: string, options: any = DEFAULT_PARSE): any[] {
    const parsed = this.csvParser.parse(data, options);
    return parsed.data;
  }
}