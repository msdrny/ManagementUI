import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';

//const hostApi = process.env.NODE_ENV === 'development' ? 'http://192.168.12.105' : 'https://flatlogic-node-backend.herokuapp.com';
//const portApi = process.env.NODE_ENV === 'development' ? 8086 : '';
//const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}`;

@Injectable()
export class AppConfig {
  config = {
    remote: 'https://flatlogic-node-backend.herokuapp.com',
    isBackend: environment.backend,
   // hostApi,
    //portApi,
    //baseURLApi,
    auth: {
      email: 'admin@flatlogic.com',
      password: 'password'
    },
    settings: {
      colors: {
        'white': '#fff',
        'black': '#000',
        'gray-light': '#999',
        'gray-lighter': '#eee',
        'gray': '#666',
        'gray-dark': '#343434',
        'gray-darker': '#222',
        'gray-semi-light': '#777',
        'gray-semi-lighter': '#ddd',
        'brand-primary': '#5d8fc2',
        'brand-success': '#64bd63',
        'brand-warning': '#f0b518',
        'brand-danger': '#dd5826',
        'brand-info': '#5dc4bf'
      },
    },
  };

  getConfig(): Object {
    return this.config;
  }
}

