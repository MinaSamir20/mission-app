import { BodyComponent } from './components/body/body.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterLink, RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BodyComponent,
    ConfirmationComponent,
    CalendarComponent,
    ImageUploadComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    OverlayModule,
    RouterModule,
    CdkMenuModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild({
      extend: true,
    }),
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    BodyComponent,
    ConfirmationComponent,
    TranslateModule,
    CalendarComponent,
  ],
})
export class SharedModule {}
