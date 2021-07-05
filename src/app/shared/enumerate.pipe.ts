import { Pipe, PipeTransform } from "@angular/core";

/**
 * Converts an array of strings into a serialised human-readable version using commas and a given 
 * conjunction (as in a human-readable list) if so wished.
 * @param [lastConjunction = ''] - Conjunction to be used at the end of enumeration if at all.
 * @param toUppercase - Array of strings that should be converted to all uppercase.
 * @returns A comma-separated listing with/without conjunction.
 */
@Pipe({
  name: 'enumerate', 
  pure: true
})
export class EnumeratePipe implements PipeTransform {
  transform(input: string[], lastConjunction: string = ', ', uppercasePropNames: string[] = ['']): string {
    return input.reduce((a, b, i, array) => {
      a = this.convertToUppercase(a, uppercasePropNames);
      b = this.convertToUppercase(b, uppercasePropNames);
      return a + (i < array.length - 1 ? ', ' : lastConjunction) + b;
    });
  }

  convertToUppercase(propName: string, uppercasePropNames: string[]): string {
    if (uppercasePropNames.indexOf(propName) > -1) {
      return propName.toUpperCase();
    } else {
      return propName;
    }
  }
}