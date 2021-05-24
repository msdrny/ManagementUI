import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public host: string;

  constructor(
    private http: HttpClient ) {
    // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
    // reading webservice which is used for SCP from a text file
    this.http.get<string>('assets/url.txt', {responseType: 'text' as 'json'}).subscribe(data => {
      this.host = data;
      console.log(data)
      localStorage.setItem('host', data);
    });

  }


}


