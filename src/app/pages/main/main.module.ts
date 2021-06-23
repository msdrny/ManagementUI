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
import { FormsModule } from '@angular/forms';
import { AnalyticsComponent } from './analytics/analytics.component';
import { BigStatComponent } from './analytics/components/big-stat/big-stat.component';
import { TaskContainerComponent } from './analytics/components/task-container/task-container.component';
import { TaskComponent } from './analytics/components/task/task';
import { VisitsComponent } from './visits/visits.component';
import { MarketStatsWidgetComponent } from './visits/market-stats-widget/market-stats-widget.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { SkyconsModule } from '../../components/skycon/skycon.module';
import { ChangesChartWidgetComponent } from './widgets/changes-chart-widget/changes-chart-widget.component';
import { NasdaqWidgetComponent } from './widgets/nasdaq-widget/nasdaq-widget.component';
import { RealtimeTrafficWidgetComponent } from './widgets/realtime-traffic-widget/realtime-traffic-widget.component';
import { AnalyticsService } from './analytics/analytics.service';
import { YearsMapModule } from '../../components/years-map-widget/year-map.module';
import { CustomDateFormatter } from './visits/custom-date-formatter.service';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { UtilsModule } from '../../utils/utils-module/utils.module';
import { FloorComponent } from './floor/floor.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SshComponent } from './ssh/ssh.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommentboxComponent } from './visits/commentbox/commentbox.component';
import { CommentsComponent } from './visits/comments/comments.component';
import { ChildboxComponent } from './visits/childbox/childbox.component';
import {  ReactiveFormsModule} from '@angular/forms';

export const routes = [
  { path: '', redirectTo: 'visits', pathMatch: 'full' },
  { path: 'analytics', component: AnalyticsComponent, pathMatch: 'full' },
  { path: 'visits', component: VisitsComponent, pathMatch: 'full' },
  { path: 'widgets', component: WidgetsComponent, pathMatch: 'full'},
  { path: 'floor', component: FloorComponent, pathMatch: 'full' },
  { path: 'heatmap', component: HeatmapComponent, pathMatch: 'full'},
  { path: 'ssh', component: SshComponent, pathMatch: 'full'}
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AnalyticsComponent,
    BigStatComponent,
    TaskContainerComponent,
    TaskComponent,
    VisitsComponent,
    MarketStatsWidgetComponent,
    WidgetsComponent,
    ChangesChartWidgetComponent,
    NasdaqWidgetComponent,
    RealtimeTrafficWidgetComponent,
    FloorComponent,
    HeatmapComponent,
    SshComponent,
    CommentboxComponent,
    CommentsComponent,
    ChildboxComponent
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
    MatSlideToggleModule,FormsModule,
    ModalModule,NgSelectModule,NgxDatatableModule
    ,ReactiveFormsModule,
    
  ],
  providers: [
    AnalyticsService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  entryComponents: [ChildboxComponent],
})
export class MainModule { }
