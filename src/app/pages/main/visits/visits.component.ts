import {
  ViewEncapsulation,
  OnDestroy,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { useTheme, create, color, Circle, MouseCursorStyle } from '@amcharts/amcharts4/core';
import { MapChart, MapPolygonSeries, projections, ZoomControl, MapImageSeries } from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_usaHigh from '@amcharts/amcharts4-geodata/usaHigh';
import { CalendarEvent } from 'angular-calendar';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { echartDynamicAreaData3 } from '../../../utils/data/echarts.data';
import { getRandomInt } from '../../../utils/functions/randomizer';
import {citySeries as citySeriesData} from '../../../utils/data/city-series.data';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CalendarData } from 'src/app/nodes/calendarData';
import { ConfigService } from 'src/app/helpers/config';
import {colors} from './visits.data'
import {url} from './visits.data'
import { NgOption } from '@ng-select/ng-select';
import { ModalDirective } from 'ngx-bootstrap';
import { MessagesHelper } from 'src/app/helpers/messages';
import { TimeHelper } from 'src/app/helpers/timeHelper';
import { SSIDStatus } from 'src/service/currentBssidSsidForClient';
import { isNumeric } from 'rxjs/util/isNumeric';
import * as moment from 'moment';
import { TestMetadata } from 'src/service/TestMetadata';
import { ApiList } from 'src/app/utils/data/apiList.data';
import UrlJson from '../../../../assets/url.json';


useTheme(am4themes_animated);
@Component({
  selector: 'visits',
  providers:[MessagesHelper,TimeHelper],
  templateUrl: './visits.template.html',
  styleUrls: ['./visits.style.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitsComponent implements OnInit, AfterViewInit, OnDestroy {
  private interval: any;
  private progressBarValueSource1: BehaviorSubject<number> = new BehaviorSubject(0);
  private progressBarValueSource2: BehaviorSubject<number> = new BehaviorSubject(0);
  private progressBarValueSource3: BehaviorSubject<number> = new BehaviorSubject(0);

  month: any;
  year: any;
  public echartDynamicAreaData3: any = echartDynamicAreaData3;
  public echartDynamicAreaDataUpdate: any;
  public map: MapChart;
  public countUpOptions = {
    separator: ' '
  };
  public progressBarValue1$: Observable<number> = this.progressBarValueSource1.asObservable();
  public progressBarValue2$: Observable<number> = this.progressBarValueSource2.asObservable();
  public progressBarValue3$: Observable<number> = this.progressBarValueSource3.asObservable();
  public viewDate: Date = new Date();
  public events: any[] ;
  public colorList=colors
  public urlList=url
  public selectedColor
  public selectedEvent
  public selectedDeleteEvent
  public selectedDate
  public deleteList: NgOption[] =[]
 public isVisible:boolean
 public countOfTotalDisconnectedDevice = 0
 public countOfTotalConnectedDevice = 0
 public countOfTotalClient = 0
 public countOfTotalConnecteClient = 0
 public countOfTotalDisconnectedClient = 0
 public cityName
 public dataForMap=citySeriesData
 public ssidList=[]
 public isActiveTest:boolean
 @ViewChild('demoModal') public demoModal:ModalDirective;
 @ViewChild('deleteModal') public deleteModal:ModalDirective;
@ViewChild('map', { static: false }) public mapRef: ElementRef<HTMLElement>;
intervalRef;
isRun=false;
timer = {elapsedTime:null}
status
className
message
elapsedTime=0
loadPercentage=0
commentForm: FormGroup;
commentInfo: Array<object> = [];
submitted: Boolean = false;
public id = 0;
public hardwareVersion
public softwareVersion
public estimatedEndDate
@Output() usercomment = new EventEmitter();
  comments: any;
  count: any;


  constructor(private zone: NgZone, private cdr: ChangeDetectorRef,private httpClient:HttpClient,private configService:ConfigService,private messageheHelper:MessagesHelper,private timeHelper:TimeHelper ) {
  }

  public async ngOnInit(): Promise<void> {
   

   await this.loadCurrentTestStatus()
   console.log(this.isActiveTest,"here is the test")
  
    await this.getApiResponseForTestMetadata()

   this.cityName=this.dataForMap[0].tooltip

    const now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
    this.insertLoadInfoToDatabase()
    var resultForClient:any=await this.messageheHelper.getCurrentStatusForClient()
    if(resultForClient){
      if(resultForClient.up){
        this.countOfTotalClient = resultForClient.up + resultForClient.down
        this.countOfTotalDisconnectedClient = resultForClient.down
        this.countOfTotalConnecteClient = resultForClient.up
      }
    }
    for (const iterator of this.urlList) {
     
      var result=await this.messageheHelper.getCurrentStatusForDevice(iterator)
      //console.log(result)
      if(result ==1){
        this.countOfTotalConnectedDevice=this.countOfTotalConnectedDevice+1
      }
      else{
        this.countOfTotalDisconnectedDevice=this.countOfTotalDisconnectedDevice+1
      }
    }

    var ssid:SSIDStatus=await this.messageheHelper.getCurrentBssidSsidforClient()
    this.ssidList=[]
    if(ssid.data.result){
      var res=ssid.data.result
      for (const iterator of res) {
        this.ssidList.push(iterator.metric)
      }

    }
   console.log(this.ssidList) 

    //console.log(this.countOfTotalDisconnectedDevice,this.countOfTotalConnectedDevice)
  

   // console.log(this.selectedColor)
  }
  async loadCurrentTestStatus() {
   // throw new Error('Method not implemented.');
    clearInterval(this.intervalRef);
    var onTime:string=""+await this.getApiResponseForTestStatus()
    if(isNumeric(onTime))
    {
      //console.log("helhelhelhelhel")
      this.status = "Test is running " 
      this.className="fa fa-circle fa-fw text-danger ml-xs"
      this.message="There is an active test"
      this.isActiveTest=true
    } 
    else if (onTime == "error"){
      this.status = "Error"
      this.className="fa fa-circle-o fa-fw text-gray-light ml-xs"
      this.message="There is a problem which the system cannot access server"
      this.isActiveTest=false
    }
    else{

      this.status = "Ready for next test"
      this.className="fa fa-circle fa-fw text-success ml-xs"
      this.message="There is no an active test"
      this.timer.elapsedTime = `00 00:00:00`
      this.isActiveTest=false

    }
  }

  async getApiResponseForTestStatus() {
    //return  await this.httpClient.get('http://192.168.10.105:4000/api/getTestStatus')
    return  await this.httpClient.get(ApiList.CURRENT_TEST_STATUS)
      .toPromise().then(async (res:any) => {
        if(isNumeric(res)){ await this.setInterval(res)}
       
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        console.log('An error occurred in Http Request'+err.message);
        return "error" 
      });
  }

 async setInterval(date){
    if(date && date!=0){
     
  //var dt= new Date(date)
  console.log(date)
  let start = moment(new Date(date * 1000));
   this.intervalRef = setInterval(() => {
    this.elapsedTime = moment(new Date()).diff(start)
    let time = moment.duration(this.elapsedTime)
    console.log( time.days(),this.elapsedTime,start)
    let days = ('0' + time.days()).slice();
    let hrs = ('0' + time.hours()).slice(-2);
    let mins = ('0' + time.minutes()).slice(-2);
    let secs = ('0' + time.seconds()).slice(-2);
  console.log(this.elapsedTime)
   this.loadPercentage=(this.elapsedTime*100)/864000000
    this.timer.elapsedTime = `${days} ${hrs}:${mins}:${secs}`
  }, 1000);
  }
  }

  insertLoadInfoToDatabase() {
    
    var date = new  Date ("04/30/2021");
    console.log(date);
    // var calendarData= new CalendarData(' <h3 class="popover-header"> Stop world water pollution    </h3>    <div class="popover-body">      Have a kick off meeting with .inc company    </div>',{primary: '#f0b518',secondary: '#f0b518'},new Date(),false,false)
   
    // let headers = new HttpHeaders();
    // headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    // .subscribe(resp => {  
    // },
    // (error:HttpErrorResponse) => {         
                
    //      //Error callback
    //   console.error('error caught in component',error)
    // });

    // this.httpClient.post(localStorage.getItem('host')+":4000/api/deleteMesud",{"draggable":calendarData.getDraggable},  {observe: 'response'})
    // .subscribe(resp => {  
    // },
    // (error:HttpErrorResponse) => {         
                
    //      //Error callback
    //   console.error('error caught in component',error)
    // });

    
    this.httpClient.get(ApiList.ALL_CALENDAR_LIST).subscribe( (resp:CalendarEvent[])=>
      {this.events=[]
        //console.log(resp[0])
        resp.forEach(element => {
          element.start=new Date(element.start)
          var titleOfELement= element.title
          var title = titleOfELement.split("     ")[1]
          title= title.substring( 0,title.lastIndexOf(" ") );
         // console.log(title)
          // var title = element.title.substring(
          //   element.title.lastIndexOf('<div class="popover-body     ">') +72, 
          //   element.title.lastIndexOf("    </div>") );
          //  // console.log(title )
          //  // console.log(element.title)
            this.deleteList.push({date:element.start,originalTitle:element.title,title:title})
        });
      
        this.events=resp
        //console.log(this.deleteList)
      })
}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.progressBarValueSource1.next(getRandomInt());
      this.progressBarValueSource2.next(getRandomInt());
      this.progressBarValueSource3.next(getRandomInt());
    });

    this.interval = setInterval(() => {
      const data1: any = this.echartDynamicAreaData3.series[0].data;
      const data2: any = this.echartDynamicAreaData3.series[1].data;
      data1.shift();
      data1.push(parseInt(Math.round(Math.random() * 1000).toFixed(0), 10));
      data2.shift();
      data2.push(parseInt((Math.random() * 10 + 5).toFixed(0), 10));
      this.echartDynamicAreaDataUpdate = {
        series: [
          { data: data1 },
          { data: data2 }
        ]
      };
      this.cdr.markForCheck();
    }, 3000);

    this.zone.runOutsideAngular(() => {
      const map = create(this.mapRef.nativeElement, MapChart);
      map.geodata = am4geodata_usaHigh;
      map.projection = new projections.AlbersUsa();
      const polygonSeries = map.series.push(new MapPolygonSeries());
      polygonSeries.useGeodata = true;
      map.homeZoomLevel = 1.1;
      map.chartContainer.wheelable = false;
      map.seriesContainer.draggable = false;
      map.seriesContainer.events.disableType('doublehit');
      map.chartContainer.background.events.disableType('doublehit');

      map.zoomControl = new ZoomControl();
      map.zoomControl.align = 'left';
      map.zoomControl.valign = 'bottom';
      map.zoomControl.dy = -10;

      map.zoomControl.minusButton.background.fill = color('#000');
      map.zoomControl.minusButton.background.fillOpacity = 0.24;
      map.zoomControl.minusButton.background.stroke = null;
      map.zoomControl.plusButton.background.fill = color('#000');
      map.zoomControl.plusButton.background.fillOpacity = 0.24;
      map.zoomControl.plusButton.background.stroke = null;
      map.zoomControl.plusButton.label.fill = color('#fff');
      map.zoomControl.plusButton.label.fontWeight = '600';
      map.zoomControl.plusButton.label.fontSize = 16;
      map.zoomControl.minusButton.label.fill = color('#fff');
      map.zoomControl.minusButton.label.fontWeight = '600';
      map.zoomControl.minusButton.label.fontSize = 16;
      map.zoomControl.cursorOverStyle = MouseCursorStyle.pointer;
      let plusButtonHoverState = map.zoomControl.plusButton.background.states.create('hover');
      plusButtonHoverState.properties.fill = color('#ccc');
      let minusButtonHoverState = map.zoomControl.minusButton.background.states.create('hover');
      minusButtonHoverState.properties.fill = color('#ccc');

      const polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = color('#fff');
      polygonTemplate.fillOpacity = 0.2;
      polygonTemplate.stroke = color('#293647');
      const hs = polygonTemplate.states.create('hover');
      hs.properties.fillOpacity = 0.5;

      polygonTemplate.strokeOpacity = 0.4;

      const citySeries = map.series.push(new MapImageSeries());
      citySeries.data = citySeriesData;
      citySeries.dataFields.value = 'size';

      const city = citySeries.mapImages.template;
      city.nonScaling = true;
      city.propertyFields.latitude = 'latitude';
      city.propertyFields.longitude = 'longitude';
      const circle = city.createChild(Circle);
      circle.fill = color('#ffc247');
      circle.stroke = color('#ffffff');
      circle.strokeWidth = 0;
      const circleHoverState = circle.states.create('hover');
      circleHoverState.properties.strokeWidth = 1;
      circle.tooltipText = '{tooltip}';
      circle.propertyFields.radius = 'size';

      this.map = map;
    });
  }

  public ngOnDestroy(): void {
    if (Boolean(this.interval)) { clearInterval(this.interval); }

    this.zone.runOutsideAngular(() => {
      if (Boolean(this.map)) {
        this.map.dispose();
      }
    });
  }

  public onEventClick({ event, sourceEvent }: { event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent; }): void {
    if (Array.isArray(event.actions)) {
      event.actions.forEach(a => {
        a.onClick({ event, sourceEvent });
      });
    }
  }

  public addNewEvent(){
    console.log("Its Works")
    console.log(this.selectedColor , this.selectedDate, this.selectedEvent)
  if(this.selectedColor && this.selectedDate && this.selectedEvent){
    var startDate = this.selectedDate.startDate.format('MM/DD/YYYY')

    //var startDate= new Date(moment(this.selectedDate).format('MM/DD/YYYY').toString())
    console.log(startDate)
    var calendarData= new CalendarData(' <h3 class="popover-header">   </h3>    <div class="popover-body">     '+this.selectedEvent+'    </div>',{primary: this.selectedColor,secondary: '#f0b518'},new Date(startDate),false,false)
   
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    this.httpClient.post(ApiList.NEW_CALAENDAR_EVENT,calendarData,  {observe: 'response', responseType: 'text'})
    .subscribe(resp => { 
      console.log("Event is added successfully")
      this.insertLoadInfoToDatabase()
       this.demoModal.hide()
       this.messageheHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {         
      
      this.messageheHelper.showUnsuccesfulMessage()
      console.error('error caught in component',error)
    });
  }
  else{
    alert("Fill the the inputs")

  }
}

public deleteEvent(){
  if(this.selectedDeleteEvent){
 var data=this.selectedDeleteEvent.split("!@!")
       this.httpClient.post(ApiList.DELETE_CALAENDAR_EVENT,{"start":new Date(data[0]),title:data[1]},  {observe: 'response', responseType: 'text'})
    .subscribe(resp => {  
      this.insertLoadInfoToDatabase()
      this.deleteModal.hide()
      this.messageheHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {         
    this.messageheHelper.showUnsuccesfulMessage()
         //Error callback
         this.deleteModal.hide()
      console.error('error caught in component',error)
    });

  }
  else{
    alert("Please select event")
  }
console.log(this.selectedDeleteEvent)
}



async getApiResponseForTestMetadata() {
  var url =ApiList.CURRENT_TEST_METADATA
  //return  await this.httpClient.get('http://192.168.10.105:4000/api/getTestStatus')
  return  await this.httpClient.get(url)
    .toPromise().then(async (res:TestMetadata) => {
      if(res){
        console.log(res.estimated_end_time,res.hardware_version,res.software_version)
        this.estimatedEndDate=res.estimated_end_time
        this.hardwareVersion=res.hardware_version
       this.softwareVersion=res.software_version
      }
     
return res;
    }).catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      console.log('An error occurred in Http Request'+err.message);
      return "error" 
    });
}

receiveComment($event) {
  this.comments = $event;
  
  this.count = this.comments.length;
  console.log(this.comments.length);
}

recieveCount($event) {
  this.comments = $event;
  this.count = this.comments.length;
  this.receiveComment($event)
  console.log($event);
}


}
