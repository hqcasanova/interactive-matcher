import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, pick } from "lodash-es";

/**
 * Convenience transform to turn a given object into a string of all its property values.
 * @param input - Object representative of data to turn into string. If it is already a string, the pipe
 * has no effect.
 * @param properties - Those whose values are to be included in the resulting string. By default, it
 * will take all existing properties in.
 * @returns String of property values. If an empty or no recording is passed in, an empty
 * string is returned.
 */
@Pipe({
  name: 'serialise', 
  pure: true
})
export class SerialisePipe implements PipeTransform {
  transform(input: Object | string, properties: string[] = Object.keys(input || {})): string {
    if (typeof input === 'string') {
      return input;
    }
    
    if (!input || isEmpty(input)) {
      return '';
    }

    const definedValues = Object.values(pick(input, properties)).filter(Boolean);
    return definedValues.join(' ');
  }
}