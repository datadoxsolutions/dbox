import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstChar' })
export class FirstCharPipe implements PipeTransform {
  transform(stringText: any) {
    if (stringText) {
      return stringText.charAt(0).toUpperCase();
    } else {
      return '';
    }
  }
}
