import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

interface sidebarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Output() onToggleSidenav: EventEmitter<sidebarToggle> = new EventEmitter();
  collapesed = false;
  screenWidth = 0;
  navData: any = [
    {
      routeLink: 'main',
      icon: 'fal fa-home',
      label: this.translate.instant('sidebar.dashboard'),
    },
    {
      routeLink: 'categories',
      icon: 'fal fa-box-open',
      label: this.translate.instant('sidebar.categories'),
    },
    {
      routeLink: 'users',
      icon: 'fal fa-users',
      label: this.translate.instant('sidebar.coordinators'),
    },
    {
      routeLink: 'schools',
      icon: 'fal fa-school',
      label: this.translate.instant('sidebar.schools'),
    },
    {
      routeLink: 'tasks',
      icon: 'fal fa-list-ul',
      label: this.translate.instant('sidebar.missions'),
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-cog',
      label: this.translate.instant('sidebar.settings'),
    },
  ];
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapesed = false;
      this.onToggleSidenav.emit({
        collapsed: this.collapesed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void {
    this.collapesed = !this.collapesed;
    this.onToggleSidenav.emit({
      collapsed: this.collapesed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidebar(): void {
    this.collapesed = false;
    this.onToggleSidenav.emit({
      collapsed: this.collapesed,
      screenWidth: this.screenWidth,
    });
  }
  constructor(private translate: TranslateService) {}
}
