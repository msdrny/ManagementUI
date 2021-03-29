import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { delay, startWith, tap } from 'rxjs/operators';
import { Options } from 'sortablejs';

import {
  DefaultWidgedData,
  initialDefaultWidgetData,
  updatedDefaultWidgetData,
  SharesWidgetData,
  initialSharesWidgetData,
  updatedSharedWidgetData,
  initialAutoloadWidgetData,
  updatedAutoloadWidgetData,
  NewsWidgetData,
  initialNewsWidgetData,
  updatedNewsWidgetData
} from './grid.data';

const TIMEOUT: number = 1000;

@Component({
  selector: '[grid]',
  templateUrl: './grid.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./grid.style.scss']
})
export class GridComponent implements OnInit {
  public options: Options = {
    animation: 150,
    filter: '.locked',
    draggable: '.widget',
    ghostClass: 'widget-placeholder',
    group: 'group'
  };

  public defaultWidgetData$: Observable<DefaultWidgedData[]>;
  public defaultLoading: boolean = false;
  public sharesWidgetData$: Observable<SharesWidgetData[]>;
  public sharesLoading: boolean = false;
  public autoloadWidgetData$: Observable<string>;
  public autoloadLoading: boolean = false;
  public newWidgetData$: Observable<NewsWidgetData[]>;
  public newsLoading: boolean = false;

  private defaultWidgetDataSource: ReplaySubject<DefaultWidgedData[]> = new ReplaySubject(1);
  private sharesWidgetDataSource: ReplaySubject<SharesWidgetData[]> = new ReplaySubject(1);
  private autolaodWidgetDataSource: ReplaySubject<string> = new ReplaySubject(1);
  private newsWidgetDataSource: ReplaySubject<NewsWidgetData[]> = new ReplaySubject(1);

  ngOnInit(): void {
    this.defaultWidgetData$ = this.defaultWidgetDataSource.asObservable().pipe(
      delay(TIMEOUT),
      tap(() => { this.defaultLoading = false; }),
      startWith(initialDefaultWidgetData)
    );
    this.sharesWidgetData$ = this.sharesWidgetDataSource.asObservable().pipe(
      delay(TIMEOUT),
      tap(() => { this.sharesLoading = false; }),
      startWith(initialSharesWidgetData)
    );
    this.autoloadWidgetData$ = this.autolaodWidgetDataSource.asObservable().pipe(
      delay(TIMEOUT),
      tap(() => { this.autoloadLoading = false; }),
      startWith(initialAutoloadWidgetData)
    );
    this.newWidgetData$ = this.newsWidgetDataSource.asObservable().pipe(
      delay(TIMEOUT),
      tap(() => { this.newsLoading = false; }),
      startWith(initialNewsWidgetData)
    );
  }

  public onDefaultReload(): void {
    this.defaultLoading = true;
    this.defaultWidgetDataSource.next(updatedDefaultWidgetData);
  }

  public onSharesReload(): void {
    this.sharesLoading = true;
    this.sharesWidgetDataSource.next(updatedSharedWidgetData);
  }

  public onAutoloadReload(): void {
    this.autoloadLoading = true;
    this.autolaodWidgetDataSource.next(updatedAutoloadWidgetData);
  }

  public onNewsReload(): void {
    this.newsLoading = true;
    this.newsWidgetDataSource.next(updatedNewsWidgetData);
  }

  public onFullscreenMode(fullscreen: boolean): void {
    this.options = {
      ...this.options,
      disabled: fullscreen
    };
  }
}
