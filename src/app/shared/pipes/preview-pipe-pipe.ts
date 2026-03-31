import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'previewContent',
})
export class PreviewContentPipe implements PipeTransform {
  transform(value: string, limit: number = 150, suffix: string = '...'): string {
    if(!value){
      return '';
    }

    if(value.length <= limit){
      return value;
    }

    return value.substring(0, limit).trim() + suffix;
  }
}
