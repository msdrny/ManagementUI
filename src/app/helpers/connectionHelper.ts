import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from './config';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionHelper {

  private httpOptions: { headers: HttpHeaders; responseType: 'json' };
  private httpOptionsAsJson: { headers: HttpHeaders };

  constructor(private http: HttpClient,
              private config: ConfigService) {
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Set Http Options for webservices which use text content-type
  public getHttpOptionAsText(email: string, password: string) {
    return this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(email + ':' + password)
      }), responseType: 'text' as 'json'
    };
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Set Http Options for webservices which use json content-type
  public getHttpOptionAsJson(email: string, password: string) {
    return this.httpOptionsAsJson = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(email + ':' + password)
      })
    };
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Execute get operation for selected webservices return json
  httpGET<T>(endPoint: string, email: string, password: string): Observable<T> {
    const url = localStorage.getItem('host') + endPoint;
    return this.http.get<T>(url, this.getHttpOptionAsJson(email, password));
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Execute get operation for selected webservices and it return text
  httpGETforText<T>(endPoint: string, email: string, password: string): Observable<T> {
    const url = localStorage.getItem('host') + endPoint;
    return this.http.get<T>(url, this.getHttpOptionAsText(email, password));
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Execute get operation for selected webservices return user list json
  httpGETforList<T>(pathParam: String, searchParam: String, endPoint: string, email: string, password: string): Observable<T> {
    const url = localStorage.getItem('host') + endPoint + '/' + searchParam + '/' + pathParam;
    return this.http.get<T>(url, this.getHttpOptionAsJson(email, password));
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Execute put operation for selected webservices
  httpPUT<T>(pathParam: String, endPoint: string, email: string, password: string): Observable<T> {
    const url = localStorage.getItem('host') + endPoint + '/' + pathParam;
    return this.http.put<T>(url, '', this.getHttpOptionAsText(email, password));
  }

  // 05/21/2019 10:00 AM, //merenay, Pia-Team Inc.
  // Execute post operation for selected webservices
  httpPOST<T>(pathParam: String, endPoint: string, email: string, password: string): Observable<T> {
    const url = localStorage.getItem('host') + endPoint + '/' + pathParam;
    return this.http.post<T>(url, '', this.getHttpOptionAsText(email, password));
  }


}
