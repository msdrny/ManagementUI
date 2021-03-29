import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrendModule } from 'ngx-trend';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { CountUpModule } from 'ngx-countup';
import { CalendarModule as AngularCalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyconsModule } from '../../components/skycon/skycon.module';
import { YearsMapModule } from '../../components/years-map-widget/year-map.module';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { UtilsModule } from '../../utils/utils-module/utils.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlugsComponent } from './plugs/plugs.component';
import { HackrfComponent } from './hackrf/hackrf.component';
import { NgxSpinnerModule } from "ngx-spinner";

export const routes = [
  { path: '', redirectTo: 'visits', pathMatch: 'full' },
  { path: 'plugs', component: PlugsComponent, pathMatch: 'full'},
   {path: 'hackrf', component: HackrfComponent, pathMatch: 'full' }
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
PlugsComponent,
    HackrfComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TrendModule,
    SkyconsModule,
    NgApexchartsModule,
    NgxEchartsModule,
    YearsMapModule,
    SwiperModule,
    CountUpModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    WidgsterModule,
    ProgressbarModule,
    BsDropdownModule,
    UtilsModule,
    MatButtonModule,
    NgApexchartsModule,
    MatRadioModule,
    MatSelectModule,
    NgxDaterangepickerMd.forRoot(),
    MatSlideToggleModule,NgxSpinnerModule,
    NgSelectModule, FormsModule, ReactiveFormsModule
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: CalendarDateFormatter,
    }
  ]
})
export class ManageModule { }
