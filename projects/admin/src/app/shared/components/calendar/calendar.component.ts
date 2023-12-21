import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  constructor() {
    let month_names = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let daysMonth = [31, this.getFebDay(this.year), 31,30,31,30,31,31,30,31,30,31]
    let currDate = new Date()
    let firstDay = new Date(this.month, this.year, 1)
  }
  year: any = 0;
  month: any = 0;


  isLeapYear(year: any) {
    this.year = year;
    return (
      (this.year % 4 === 0 && this.year % 100 !== 0 && this.year % 400 !== 0) ||
      (this.year % 100 === 0 && this.year % 400 === 0)
    );
  }

  getFebDay(year: any) {
    return this.isLeapYear(year) ? 29 : 28;
  }
}
