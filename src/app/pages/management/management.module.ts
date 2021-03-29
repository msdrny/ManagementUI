import { NgModule } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatButtonModule } from '@angular/material/button';
import { PlugsComponent } from './plugs/plugs.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SkyconsModule } from '../../components/skycon/skycon.module';
import { YearsMapModule } from '../../components/years-map-widget/year-map.module';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { UtilsModule } from '../../utils/utils-module/utils.module';


export const routes = [
  { path: '', redirectTo: 'visits', pathMatch: 'full' },
  { path: 'plugs', component: PlugsComponent, pathMatch: 'full' },
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    // Components / Directives/ Pipes


  ],
  imports: [SkyconsModule,
    YearsMapModule,
    WidgsterModule,
    UtilsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TrendModule,
    NgApexchartsModule,
    NgxEchartsModule,
    SwiperModule,
    CountUpModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ProgressbarModule,
    BsDropdownModule,
    MatButtonModule,
    NgApexchartsModule,
    MatRadioModule,
    MatSelectModule,
    NgxDaterangepickerMd.forRoot(),
    MatSlideToggleModule,
    UiSwitchModule
  
    
  ],

  providers: [

    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: CalendarDateFormatter
    }
  ]
})
export class ManagementModule { }
