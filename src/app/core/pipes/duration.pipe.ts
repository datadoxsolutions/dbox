import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(duration: any) {
    let textDuration = '';
    if (duration > 0) {
      const minutes: any = (duration / 60000).toFixed(0);
      if (minutes <= 1 ) {
        textDuration = 'minute';
      } else {
        textDuration = minutes + ' minutes';
      }
    }
    return textDuration;
  }
}
