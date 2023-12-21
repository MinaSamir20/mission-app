import { Component, HostListener, OnInit } from '@angular/core';
import { notifications, userItems } from './header-dummy-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  lang: any = 'en';
  constructor(private translate: TranslateService) {
    this.lang = translate.currentLang;
  }
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }
  canShowSearchAsOverlay = false;

  notifications = notifications;
  userItems = userItems;

  changeLanguage() {
    if (this.lang == 'en') {
      localStorage.setItem('language', 'ar');
    } else {
      localStorage.setItem('language', 'en');
    }
    window.location.reload();
  }

  checkCanShowSearchAsOverlay(innerwidth: number): void {
    if (innerwidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }
}
