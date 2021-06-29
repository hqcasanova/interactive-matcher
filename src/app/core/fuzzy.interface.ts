import { Injectable } from "@angular/core";

import { FuseService } from "./fuse.service";

@Injectable({
	providedIn: 'root',
	useClass: FuseService
})
export abstract class FuzzyService {
  abstract searchKeys: string[];
  abstract search(
    collection: any[], 
    query: string | Object, 
    options?: any
  ): any[];
  abstract sortDurationDiff(
    collection: any[], 
    duration: string,
    bubbleCutoff?: number
  ): any[]
}