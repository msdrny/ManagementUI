import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { ActiveToast, ToastrService } from "ngx-toastr";
import { SSIDStatus } from "src/service/currentBssidSsidForClient";
import { CurrentStatus } from "src/service/currentStatus";
import { ClientStatus } from "src/service/currentStatusForClient";
import { ToastPosition } from "../pages/ui-elements/notifications/toast-position.enum";

import { RetryDestroyingToastComponent } from "../pages/ui-elements/notifications/toasts/retry-destroying/retry-destroying-toast.component";
import { SuccessToastComponent } from "../pages/ui-elements/notifications/toasts/suceess/success-toast.component";

@Injectable({
    providedIn: 'root'
  })
  @Injectable()
export class TimeHelper {

    constructor(private toastr: ToastrService,private spinner: NgxSpinnerService,private httpClient:HttpClient) { }
    public position: ToastPosition = ToastPosition.bottomRight;
    public timeOut: number = 5000;

  async  setInterval(date,intervalRef,timer){
      if(date && date!=0){
       
    //var dt= new Date(date)
    console.log(date)
    let start = moment(new Date(date * 1000));
     intervalRef = setInterval(() => {
      let elapsedTime = moment(new Date()).diff(start)
      let time = moment.duration(elapsedTime)
      console.log( time.days(),elapsedTime,start)
      let days = ('0' + time.days()).slice();
      let hrs = ('0' + time.hours()).slice(-2);
      let mins = ('0' + time.minutes()).slice(-2);
      let secs = ('0' + time.seconds()).slice(-2);
    
      timer.elapsedTime = `${days} ${hrs}:${mins}:${secs}`
    }, 1000);
    }
    }
    


public showUnsuccesfulMessage(): void {

    const toast: ActiveToast<RetryDestroyingToastComponent> = this.toastr.show(
      'Error has been faced during operation ',
      null,
      {
        closeButton: true,
        positionClass: this.position,
        toastComponent: RetryDestroyingToastComponent,
        timeOut: this.timeOut,
        progressBar: true,
        tapToDismiss: false,
  
  
      }
    );
  
  }

  public showSuccessMessage(): void {
    this.toastr.show(
      'Operation has been implemented successfully',
      null,
      {
        closeButton: false,
        positionClass: this.position,
        toastComponent: SuccessToastComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public async getCurrentStatusForDevice(url:string){
  //  console.log("Its Works")
    var now = Math.round(+new Date()/1000);
    var end=  now+5
    var statusUrl="http://192.168.10.107:9090/api/v1/query_range?query=up%7Binstance%3D%22"+url+"%3A9100%22%7D&start="+now+"&end="+end+"&step=15"
    //var startDate = this.selectedDate.startDate.format('MM/DD/YYYY')

    //var startDate= new Date(moment(this.selectedDate).format('MM/DD/YYYY').toString())
    //console.log(startDate)
   
   
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    return  await  this.httpClient.get(statusUrl).toPromise().then((res:CurrentStatus) => { 
      // console.log("Event is added successfully")
      var resultOfStatus=0
      if(res){
        var data= res.data
        if(data){
          var status=data.result[0].metric.__name__
      //    console.log(data.result[0].metric)
          if(status =="up"){
            resultOfStatus=1
          }
        }
      }
      // console.log(resultOfStatus)
      return resultOfStatus

    },
    (error:HttpErrorResponse) => {         
      
      console.error('error caught in component',error)
    });



  

}

public async getCurrentStatusForClient(){
  console.log("Its Works")
  // const now = Date.now();
  var now = Math.round(+new Date()/1000);
  console.log(now)
  var statusUrl="http://192.168.10.107:9090/api/v1/query?query=node_network_info%7Binstance%3D~%22(192%5C%5C.168%5C%5C.10%5C%5C.110%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.120%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.130%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.140%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.150%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.160%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.170%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.180%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.190%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.210%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.220%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.230%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.240%3A9100)%22%2Cdevice!~%22eth0%7Ctap.%7Cveth.%7Cbr.%7Cdocker.%7Cvirbr*%7Clo*%7Cwl*%7Cwlan0%22%7D&time="+now 
  console.log(statusUrl)
  let headers = new HttpHeaders();
  headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
  // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
  return  await  this.httpClient.get(statusUrl).toPromise().then((res:ClientStatus) => { 
    // console.log("Event is added successfully")
    // console.log(res)
    var result={}
    var up=0
    var down=0




    if(res){
      var data= res.data
      if(data){
        var operstate=data.result[0].metric.operstate
        for (const iterator of data.result) {
          if(iterator.metric.device != "wlan0" && iterator.metric.device.startsWith("wlan") && !iterator.metric.device.startsWith("192.168.10.107")){
            if(iterator.metric.operstate =="up"){
              up=up+1
            }
            else{
              down=down+1
            }
          }

      
        }

      }
    }
result={"up":up,"down":down}
    return result

  },
  (error:HttpErrorResponse) => {         
    
    console.error('error caught in component',error)
  });





}





public async getCurrentBssidSsidforClient(){
  console.log("Its Works")
  // const now = Date.now();
  var now = Math.round(+new Date()/1000);
  console.log(now)
  var statusUrl="http://192.168.10.107:9090/api/v1/query?query=node_wifi_station_info%7Binstance%3D~%22(192%5C%5C.168%5C%5C.10%5C%5C.105%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.107%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.110%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.120%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.130%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.140%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.150%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.160%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.170%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.180%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.190%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.210%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.220%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.230%3A9100%7C192%5C%5C.168%5C%5C.10%5C%5C.240%3A9100)%22%7D%20&time="+now 
  console.log(statusUrl)
  let headers = new HttpHeaders();
  headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
  // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
  return  await  this.httpClient.get(statusUrl).toPromise().then((res:SSIDStatus) => { 
    console.log("Event is added successfully")
    console.log(res)
    return res

  },
  (error:HttpErrorResponse) => {         
    
    console.error('error caught in component',error)
    return null
  });





}



}