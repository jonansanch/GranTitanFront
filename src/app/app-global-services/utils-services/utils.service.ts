import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

   dateDiffMethod(firstDate: string, secondDate: string, calcule: string): number {

        const date1 = new Date(firstDate);
        const date2 = new Date(secondDate);

        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

       switch(calcule) {
            case 'years':
                const years = date1.getFullYear() === date2.getFullYear() ?
                    1 : date2.getFullYear() - date1.getFullYear();
                return years;
            case 'days':
                return diffDays;
            case 'seconds':
                return diffTime;
            default:
                return 0;
       }
   }
}
