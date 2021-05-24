import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ActiveToast, ToastrService } from "ngx-toastr";
import { filter, takeUntil } from "rxjs/operators";
import { CurrentStatus } from "src/service/currentStatus";
import { HeatmapResults } from "src/service/InfluxDBHeatmapHistory";
import { ToastPosition } from "../pages/ui-elements/notifications/toast-position.enum";
import { RetryAction } from "../pages/ui-elements/notifications/toasts/retry-destroying/retry-action.enum";
import { RetryDestroyingToastComponent } from "../pages/ui-elements/notifications/toasts/retry-destroying/retry-destroying-toast.component";
import { SuccessToastComponent } from "../pages/ui-elements/notifications/toasts/suceess/success-toast.component";

@Injectable({
    providedIn: 'root'
  })
  @Injectable()
export class MessagesHelper {

    constructor(private toastr: ToastrService,private spinner: NgxSpinnerService,private httpClient:HttpClient) { }
    public position: ToastPosition = ToastPosition.bottomRight;
    public timeOut: number = 5000;
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
    console.log("Its Works")
  
    var statusUrl="http://192.168.10.107:9090/api/v1/query_range?query=up%7Binstance%3D%22"+url+"%3A9100%22%7D&start=1621214134&end=1621214138&step=15"
    //var startDate = this.selectedDate.startDate.format('MM/DD/YYYY')

    //var startDate= new Date(moment(this.selectedDate).format('MM/DD/YYYY').toString())
    //console.log(startDate)
   
   
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    return  await  this.httpClient.get(statusUrl).toPromise().then((res:CurrentStatus) => { 
      console.log("Event is added successfully")
      var resultOfStatus=0
      if(res){
        var data= res.data
        if(data){
          var status=data.result[0].metric.__name__
          console.log(data.result[0].metric)
          if(status =="up"){
            resultOfStatus=1
          }
        }
      }
      console.log(resultOfStatus)
      return resultOfStatus

    },
    (error:HttpErrorResponse) => {         
      
      console.error('error caught in component',error)
    });



  

}

}