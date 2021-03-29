import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { filter, takeUntil } from 'rxjs/operators';
import { HeatmapResults } from 'src/service/InfluxDBHeatmapHistory';
import { Results } from 'src/service/InfluxDBResults';
import { ToastPosition } from '../../ui-elements/notifications/toast-position.enum';
import { CancelLaunchToastComponent } from '../../ui-elements/notifications/toasts/cancel-launch/cancel-launch-toast.component';
import { RetryAction } from '../../ui-elements/notifications/toasts/retry-destroying/retry-action.enum';
import { RetryDestroyingToastComponent } from '../../ui-elements/notifications/toasts/retry-destroying/retry-destroying-toast.component';
import { SuccessToastComponent } from '../../ui-elements/notifications/toasts/suceess/success-toast.component';
import { defaultData, percentage } from './hackrf.data';

@Component({
  selector: 'app-hackrf',
  templateUrl: './hackrf.component.html',
  styleUrls: ['./hackrf.component.scss']
})
export class HackrfComponent implements OnInit {

  status:String
  onTime:String
  colorOfBar:String
  className:String
  message:String
  loadPercentage:Number
 channelMap= new Map();
 channelList:NgOption[]=defaultData
 selectedChannel:number
 selectedPercentage: number;
 public timeOut: number = 10000;
 percentage = percentage
 public position: ToastPosition = ToastPosition.bottomRight;
  constructor(private httpClient:HttpClient,private toastr: ToastrService,private spinner: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.onTime=await this.getApiResponseForHackrfStatus()
    console.log(this.channelList)
    if(this.onTime.includes("00:00"))
    {
      this.status = "Ready for next load"
      this.className="fa fa-circle fa-fw text-success ml-xs"
      this.message="There is no noise load on gateway"


    } 
    else if (this.onTime == "error"){
      this.status = "Disabled"
      this.className="fa fa-circle-o fa-fw text-gray-light ml-xs"
      this.message="There is no noise load on gateway"
    }
    else{
      this.status = "Busy " 
      this.className="fa fa-circle fa-fw text-danger ml-xs"
      this.loadPercentage =this.validateResponse(await this.getCurrentLoad())
      this.getBarColor(this.loadPercentage)

    }
  }

  async getApiResponseForHackrfStatus() {
    return  await this.httpClient.get('http://192.168.10.51:4000/api/getHackrfStatus')
      .toPromise().then((res:String) => {
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        console.log('An error occurred in Http Request'+err.message);
        return "error" 
      });
  }

  async killHackrfProcess() {
    return  await this.httpClient.get('http://192.168.10.51:4000/api/stopHackrfLoad')
      .toPromise().then((res:String) => {
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        console.log('An error occurred in Http Request'+err.message);
        return "error" 
      });
  }

  toggleDevice(percentage,frequency) {
    let httpParams = new HttpParams()
    .append("percentage", percentage)
    .append("frequency", frequency)

      let headers = new HttpHeaders();
      headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
      this.httpClient.post("http://192.168.10.51:4000/api/startHackrfLoad",  {params: httpParams,observe: 'response'})
      .subscribe(resp => {
        this.spinner.hide();
        this.showSuccessMessage()
        
      },
      (error:HttpErrorResponse) => {         
        this.spinner.hide();                  
           //Error callback
        console.error('error caught in component',error)
        this.showUnsuccesfulMessage(percentage,frequency)
      });
  }

  async getCurrentLoad() {
    return  await this.httpClient.get("http://192.168.10.105:8086/query?db=rssi&q= select LAST(percentage) from hackrfLoad")
      .toPromise().then((res:Results) => {
      return res;
      }).catch((err: HttpErrorResponse) => {

        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }

 private validateResponse(res:Results){
   var result= null
   if(res){
if(res.results){
 var element= res.results.length
  if(element>0){
    var childElement=res.results[0].series.length
    if(childElement>0){
      var child=res.results[0].series[0].values.length
      if(child>0){
        return res.results[0].series[0].values[0][1]

      }
    }
  }

}
   }



 }

 private getBarColor(value:Number){
   if(value<50){
     this.colorOfBar="success"
   }
   else if(value> 49 && value< 70 ){
    this.colorOfBar="warning"
   }
   else if( value>70){
    this.colorOfBar="danger"
   }

   this.message= "There is %"+value+" noise load on gateway"
 }



public async runHackrf(){
  if(this.selectedChannel,this.selectedPercentage)
  {
this.killHackrfProcess()
await this.toggleDevice(this.selectedPercentage,this.selectedChannel)
  }
  else{
alert("Please choose a channel and percentage")
  }
}

public showUnsuccesfulMessage(percentage,frequency): void {

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

  toast.onAction.pipe(
    filter((action: RetryAction) => action === RetryAction.retry),
    filter((_: RetryAction, index: number) => index % 2 > 0),
    takeUntil(toast.onHidden)
  ).subscribe(() => {
    this.toastr.remove(toast.toastId);
    this.spinner.show();
    this.toggleDevice(percentage,frequency)
    //this.destroyAlienPlanet();
  });

  toast.onAction.pipe(
    filter((action: RetryAction) => action === RetryAction.cancel),
    takeUntil(toast.onHidden)
  ).subscribe(() => {
    this.toastr.remove(toast.toastId);
  });
}

public destroyAlienPlanet(): void {
  this.toastr.show(
    'Alien planet destroyed!',
    null,
    {
      closeButton: false,
      positionClass: this.position,
      toastComponent: CancelLaunchToastComponent,
      timeOut: this.timeOut,
      tapToDismiss: false
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
 
}
