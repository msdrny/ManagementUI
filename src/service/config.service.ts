import { Injectable,APP_INITIALIZER  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {  }
  load() {
    this.http
    .get<string>('assets/dashboard.json', { responseType: 'json' })
    .subscribe((data) => {
      console.log('heyyy');
      localStorage.setItem('host', data['url']);
    });
  }
}
export function ConfigFactory(config: ConfigService) {
  return () => config.load();
}

export function init() {
  return {
      provide: APP_INITIALIZER,
      useFactory: ConfigFactory,
      deps: [ConfigService],
      multi: true
  }
}

const ConfigModule = {
  init: init
}

export { ConfigModule };