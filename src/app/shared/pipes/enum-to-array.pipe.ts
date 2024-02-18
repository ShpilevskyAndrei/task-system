import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray',
  standalone: true,
})
export class EnumToArrayPipe implements PipeTransform {
  public transform(data: unknown, excludeValue?: unknown): any[] {
    if (data instanceof Object) {
      return Object.values(data).filter((val): boolean => {
        if (Array.isArray(excludeValue)) {
          return !excludeValue.includes(val);
        }

        return val !== excludeValue;
      });
    } else {
      return [data];
    }
  }
}
