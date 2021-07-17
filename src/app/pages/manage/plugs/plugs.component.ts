import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { catchError, filter, takeUntil } from 'rxjs/operators';
import { ApiList } from 'src/app/utils/data/apiList.data';

import { SmartPlug } from '../../../nodes/smartPlug';
import { ToastPosition } from '../../ui-elements/notifications/toast-position.enum';
import { CancelLaunchToastComponent } from '../../ui-elements/notifications/toasts/cancel-launch/cancel-launch-toast.component';
import { RetryAction } from '../../ui-elements/notifications/toasts/retry-destroying/retry-action.enum';
import { RetryDestroyingToastComponent } from '../../ui-elements/notifications/toasts/retry-destroying/retry-destroying-toast.component';
import { SuccessToastComponent } from '../../ui-elements/notifications/toasts/suceess/success-toast.component';



@Component({
  selector: 'app-plugs',
  templateUrl: './plugs.component.html',
  styleUrls: ['./plugs.component.scss'],
 
})
export class PlugsComponent implements OnInit {
  id: number = 40;
  row: number 
  row1 
  id1 
  row2
  public ToastPosition = ToastPosition;
  public position: ToastPosition = ToastPosition.bottomRight;
  public timeOut: number = 10000;
  public element: HTMLInputElement
  

  matrix = []

  constructor(private httpClient: HttpClient,private toastr: ToastrService,private spinner: NgxSpinnerService) {
 
  }


  async ngOnInit(): Promise<void> {
    this.spinner.show();
    var deviceList=await this.getDeviceList()
    console.log("Device List is:",deviceList)
    console.log("Device List is:",deviceList.length)
    this.row = Math.ceil(this.id / 4);
    this.row1=Array(this.row).fill(1);
    this.id1 = Array(4).fill(0).map((_, index) => index + 1);
    this.row2 = Array(deviceList.length).fill(1).map((_, index) =>deviceList[index]);
    this.configure()

    console.log(this.matrix)
  }

  stateCtrl = {
    checked: true,
    
  };
 
  changeValue(alias:String,status:boolean,event:Event,plug:SmartPlug) {
    // event.preventDefault()
    console.log(alias,status)
    this.spinner.show();
    this.toggleDevice(alias,status)
  }

  async getDeviceList() {
    return  await this.httpClient.get(ApiList.CURRENT_SMARTPLUG_LIST)
      .toPromise().then((res:SmartPlug[]) => {
        this.spinner.hide();
// this.aggregatedSum
// const temp_row = [
//   new Date(row.timestamp).getTime(),
//   row.value
// ];
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        this.spinner.hide();
        alert('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }

   toggleDevice(alias,status) {
    let httpParams = new HttpParams()
    .append("alias", alias)
    .append("status", status)

      let headers = new HttpHeaders();
      headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
      this.httpClient.post(ApiList.TOGGLE_SMARTPLUG,  {params: httpParams,observe: 'response'})
      .subscribe(resp => {
        this.spinner.hide();
        this.showSuccessMessage(alias ,status)
        
      },
      (error:HttpErrorResponse) => {         
        this.spinner.hide();                  
           //Error callback
        console.error('error caught in component')
        this.showUnsuccesfulMessage(alias ,status)
        let element = <HTMLInputElement> document.getElementById(alias);
        var isChecked=element.checked
        console.log(isChecked+" is the plug")  
        element.checked=false
        //element.click()
        
       
   
 
  
        //throw error;   //You can also throw the error to a global error handler
      });
  }
  // private handleError(error: HttpErrorResponse) {
  //   console.log(error.status); // Prints 'OK';


  //   return null;
  // }
  configure(){
    var chunk_size = 5;
    var arr = this.row2;
    var groups = arr.map(function (e, i) {
      return i % chunk_size === 0 ? arr.slice(i, i + chunk_size) : null;
    })
      .filter(function (e) { return e; });
    this.matrix = groups;
  }


  
  public showUnsuccesfulMessage(alias:String,status:boolean): void {
    var deviceStatus= status? "On":"Off"
    const toast: ActiveToast<RetryDestroyingToastComponent> = this.toastr.show(
      'Error has been faced during operation  \n Device:'+alias+' Expected Status:'+deviceStatus,
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
      this.toggleDevice(alias,status)
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

  public showSuccessMessage(alias:String,status:boolean): void {
    var deviceStatus=status ? "On" : "Off";
    this.toastr.show(
      'Operation has been implemented successfully \n Device:'+alias+' Status:'+deviceStatus,
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
