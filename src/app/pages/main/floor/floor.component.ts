import { Component, OnInit, ViewChild, ElementRef, NgZone, NgModule } from '@angular/core';
import {  HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {  Results } from '../../../../service/InfluxDBResults';
import {  IwdevInfo } from '../../../../service/IwdevInfo';
import { interval, Subscription } from 'rxjs';
import { HeatmapResults } from '../../../../service/InfluxDBHeatmapHistory';
import * as Highcharts from 'highcharts';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
import HighchartsBoost  from 'highcharts/modules/boost';
HighchartsBoost(Highcharts);
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChartComponent } from 'ng-apexcharts';
NoDataToDisplay(Highcharts); 
import { LocaleConfig } from 'ngx-daterangepicker-material/daterangepicker.config';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { ApiList } from 'src/app/utils/data/apiList.data';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {




  host = localStorage.getItem('host');
  public channelMap =new Map();
  email:String;
  password:String;
  show =false;
  res:Results;
  colors:String[]=[];
  colorsHex:String[]=[];
  legendNumbers = new Map();
  @ViewChild('picker') picker: any;
  selected: {startDate: moment.Moment, endDate: moment.Moment,status:String};
  hackrfSelected: {startDate: moment.Moment, endDate: moment.Moment,status:String};
  locale: LocaleConfig = {
    applyLabel: 'Appliquer',
    customRangeLabel: ' - ',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek(),
  }
  public rangeStatus;
  public hackrfRangeStatus;
  public destroyFlag:boolean =false;
  public destroyFlagForHackrf:boolean =false;
  public sourceforHistory = interval(5000);
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public alwaysShowCalendars:boolean
  public colSizeOfRSSIWaterfall =90*90
  public dateDifferenceForColSize
  public countForHackrf:number=0;
  public mtbfOptions= ['Choose a MTBF','MTBF1','MTBF2','MTBF3']
  // public Ranges=['All','550:650','1150:1250','1650:1750','2400:2500','5000:6000']
  public Ranges=['All','550:1750','2400:2500','5000:6000']
  public sourceHackrf = interval(10000);
  public mtbf="MTBF1"
  public hackrfTableName
  public heightForHackrf
  public uniqueValueForFrequency = new Set();
  public src;
  public srcForIperfGraph
  public rangeForCheck

  ranges: any = {
    'Today': [moment().subtract(1, 'days'), moment().subtract(1, 'seconds')],
    'Yesterday': [moment().subtract(2, 'days'), moment().subtract(86401, 'seconds')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'Current': [moment().subtract(1, 'hours'),moment.now(),'Current']
  }
  rangesHackrf: any = {
    'Current': [moment().subtract(1, 'hours'),moment.now(),'Current']
  }
  public formGroup = new FormGroup({
    date: new FormControl(new Date(2021,9,4,5,6,7), [Validators.required]),
    date2: new FormControl(new Date(), [Validators.required])
  })
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];


  
  public dateControl = new FormControl(new Date(2021,9,4,5,6,7),Validators.required);
  public dateControlMinMax = new FormControl(new Date(),Validators.required);

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
 
  
  
				init:String	= "0	0	0\r\n" + "0	0	2\r\n" + "0	0	4\r\n" + "0	0	6\r\n" + "0	0	8\r\n" + "0	0	10\r\n" + "0	0	12\r\n"
  + "0	0	14\r\n" + "0	0	16\r\n" + "0	0	17\r\n" + "0	0	19\r\n" + "0	0	21\r\n" + "0	0	23\r\n" + "0	0	25\r\n"
  + "0	0	27\r\n" + "0	0	29\r\n" + "0	0	31\r\n" + "0	0	33\r\n" + "0	0	35\r\n" + "0	0	37\r\n" + "0	0	39\r\n"
  + "0	0	41\r\n" + "0	0	43\r\n" + "0	0	45\r\n" + "0	0	47\r\n" + "0	0	49\r\n" + "0	0	51\r\n" + "0	0	53\r\n"
  + "0	0	55\r\n" + "0	0	57\r\n" + "0	0	59\r\n" + "0	0	61\r\n" + "0	0	63\r\n" + "0	0	65\r\n" + "0	0	67\r\n"
  + "0	0	69\r\n" + "0	0	71\r\n" + "0	0	73\r\n" + "0	0	75\r\n" + "0	0	77\r\n" + "0	0	79\r\n" + "0	0	81\r\n"
  + "0	0	83\r\n" + "0	0	84\r\n" + "0	0	86\r\n" + "0	0	88\r\n" + "0	0	90\r\n" + "0	0	92\r\n" + "0	0	94\r\n"
  + "0	0	96\r\n" + "0	0	98\r\n" + "0	0	100\r\n" + "0	0	102\r\n" + "0	0	104\r\n" + "0	0	106\r\n" + "0	0	108\r\n"
  + "0	0	110\r\n" + "0	0	112\r\n" + "0	0	114\r\n" + "0	0	116\r\n" + "0	0	117\r\n" + "0	0	119\r\n" + "0	0	121\r\n"
  + "0	0	123\r\n" + "0	0	125\r\n" + "0	0	127\r\n" + "0	0	129\r\n" + "0	0	131\r\n" + "0	0	133\r\n" + "0	0	135\r\n"
  + "0	0	137\r\n" + "0	0	139\r\n" + "0	0	141\r\n" + "0	0	143\r\n" + "0	0	145\r\n" + "0	0	147\r\n" + "0	0	149\r\n"
  + "0	0	151\r\n" + "0	0	153\r\n" + "0	0	155\r\n" + "0	0	157\r\n" + "0	0	159\r\n" + "0	0	161\r\n" + "0	0	163\r\n"
  + "0	0	165\r\n" + "0	0	167\r\n" + "3	0	169\r\n" + "6	0	171\r\n" + "9	0	173\r\n" + "12	0	175\r\n" + "15	0	177\r\n"
  + "18	0	179\r\n" + "21	0	181\r\n" + "24	0	183\r\n" + "26	0	184\r\n" + "29	0	186\r\n" + "32	0	188\r\n" + "35	0	190\r\n"
  + "38	0	192\r\n" + "41	0	194\r\n" + "44	0	196\r\n" + "47	0	198\r\n" + "50	0	200\r\n" + "52	0	197\r\n" + "55	0	194\r\n"
  + "57	0	191\r\n" + "59	0	188\r\n" + "62	0	185\r\n" + "64	0	182\r\n" + "66	0	179\r\n" + "69	0	176\r\n" + "71	0	174\r\n"
  + "74	0	171\r\n" + "76	0	168\r\n" + "78	0	165\r\n" + "81	0	162\r\n" + "83	0	159\r\n" + "85	0	156\r\n" + "88	0	153\r\n"
  + "90	0	150\r\n" + "93	2	144\r\n" + "96	4	138\r\n" + "99	6	132\r\n" + "102	8	126\r\n" + "105	9	121\r\n" + "108	11	115\r\n"
  + "111	13	109\r\n" + "114	15	103\r\n" + "116	17	97\r\n" + "119	19	91\r\n" + "122	21	85\r\n" + "125	23	79\r\n" + "128	24	74\r\n"
  + "131	26	68\r\n" + "134	28	62\r\n" + "137	30	56\r\n" + "140	32	50\r\n" + "143	34	47\r\n" + "146	36	44\r\n" + "149	38	41\r\n"
  + "152	40	38\r\n" + "155	41	35\r\n" + "158	43	32\r\n" + "161	45	29\r\n" + "164	47	26\r\n" + "166	49	24\r\n" + "169	51	21\r\n"
  + "172	53	18\r\n" + "175	55	15\r\n" + "178	56	12\r\n" + "181	58	9\r\n" + "184	60	6\r\n" + "187	62	3\r\n" + "190	64	0\r\n"
  + "194	66	0\r\n" + "198	68	0\r\n" + "201	70	0\r\n" + "205	72	0\r\n" + "209	73	0\r\n" + "213	75	0\r\n" + "217	77	0\r\n"
  + "221	79	0\r\n" + "224	81	0\r\n" + "228	83	0\r\n" + "232	85	0\r\n" + "236	87	0\r\n" + "240	88	0\r\n" + "244	90	0\r\n"
  + "247	92	0\r\n" + "251	94	0\r\n" + "255	96	0\r\n" + "255	98	3\r\n" + "255	100	6\r\n" + "255	102	9\r\n" + "255	104	12\r\n"
  + "255	105	15\r\n" + "255	107	18\r\n" + "255	109	21\r\n" + "255	111	24\r\n" + "255	113	26\r\n" + "255	115	29\r\n" + "255	117	32\r\n"
  + "255	119	35\r\n" + "255	120	38\r\n" + "255	122	41\r\n" + "255	124	44\r\n" + "255	126	47\r\n" + "255	128	50\r\n" + "255	130	53\r\n"
  + "255	132	56\r\n" + "255	134	59\r\n" + "255	136	62\r\n" + "255	137	65\r\n" + "255	139	68\r\n" + "255	141	71\r\n" + "255	143	74\r\n"
  + "255	145	76\r\n" + "255	147	79\r\n" + "255	149	82\r\n" + "255	151	85\r\n" + "255	152	88\r\n" + "255	154	91\r\n" + "255	156	94\r\n"
  + "255	158	97\r\n" + "255	160	100\r\n" + "255	162	103\r\n" + "255	164	106\r\n" + "255	166	109\r\n" + "255	168	112\r\n" + "255	169	115\r\n"
  + "255	171	118\r\n" + "255	173	121\r\n" + "255	175	124\r\n" + "255	177	126\r\n" + "255	179	129\r\n" + "255	181	132\r\n" + "255	183	135\r\n"
  + "255	184	138\r\n" + "255	186	141\r\n" + "255	188	144\r\n" + "255	190	147\r\n" + "255	192	150\r\n" + "255	194	153\r\n" + "255	196	156\r\n"
  + "255	198	159\r\n" + "255	200	162\r\n" + "255	201	165\r\n" + "255	203	168\r\n" + "255	205	171\r\n" + "255	207	174\r\n" + "255	209	176\r\n"
  + "255	211	179\r\n" + "255	213	182\r\n" + "255	215	185\r\n" + "255	216	188\r\n" + "255	218	191\r\n" + "255	220	194\r\n" + "255	222	197\r\n"
  + "255	224	200\r\n" + "255	226	203\r\n" + "255	228	206\r\n" + "255	229	210\r\n" + "255	231	213\r\n" + "255	233	216\r\n" + "255	235	219\r\n"
  + "255	237	223\r\n" + "255	239	226\r\n" + "255	240	229\r\n" + "255	242	232\r\n" + "255	244	236\r\n" + "255	246	239\r\n" + "255	248	242\r\n"
  + "255	250	245\r\n" + "255	251	249\r\n" + "255	253	252\r\n" + "255	255	255";
  hexDigits = new Array
    ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 


  @ViewChild('canvas', { static: true }) 




subscriptionRssi:Subscription
subscriptionHackrf:Subscription
@ViewChild("chart") chart: ChartComponent;
public chartOptions: Partial<ChartComponent>;
@ViewChild("chartLive") chartLive: ChartComponent;
public chartOptionsLive: Partial<ChartComponent>;
rows={}
chartObject: Highcharts.Chart = null;
  highChartForRssi: Highcharts.Chart;
  highChartForHackrf: Highcharts.Chart;

  


  constructor(private httpClient: HttpClient,private router: Router,private zone: NgZone,private sanitizationService: DomSanitizer,private spinner: NgxSpinnerService) {
    this.alwaysShowCalendars = true;
  }
  

  ngOnInit(): void {
    
   // this.srcForIperfGraph=this.sanitizationService.bypassSecurityTrustResourceUrl("http://10.0.50.100:3000/d-solo/QbgeMUAMz/wi-fi-test-house-hig-2-ghz-5-ghz?orgId=1&from=now-1h&to=now&refresh=10s&var-job=All&var-hostname=All&var-node=All&var-maxmount=%2Ffiles&var-name=&panelId=202")
    this.date = moment(new Date(2021,9,4,5,6,7))
   this.penetrationHistoryLive(null,null,null);
   // this.hackrf(null,null,null,null)
    this.channelInformation();
    this.HotIronBluePalette()
  //  this.subscriptionHackrf = this.sourceHackrf.subscribe(val => this.hackrfProcess(null));
   this.subscriptionRssi = this.sourceforHistory.subscribe(val => this.track());
  }


  public change(event){
    
    console.log(event)
    if(this.selected){
      if(this.selected.startDate){
        if(this.rangeStatus=="Current"){
          this.penetrationHistoryLive(null,null,null)
          this.subscriptionRssi = interval(5000).subscribe(val => this.track());
          this.rangeStatus=""
          //this.colSizeOfRSSIWaterfall=90*90
          //console.log(this.selected+" for Current Status")
        }
else{
        //console.log(this.selected+" for Current Status")
        var startDate=this.selected.startDate.unix()  * 1000000000
        var endDate=this.selected.endDate.unix()  * 1000000000
        var difference= Math.floor((this.selected.endDate.unix() -this.selected.startDate.unix())/86400)*60
        if(difference==0){
          difference=5
          this.colSizeOfRSSIWaterfall=90*90
        }
        this.dateDifferenceForColSize=this.selected.endDate.unix()-this.selected.startDate.unix()
       this.ngOnDestroyRssi()
       this.penetrationHistoryLive(startDate,endDate,difference)
       this.rangeStatus=""
      // this.colSizeOfRSSIWaterfall=90*90*12*12
      }
    }
    else{console.log("There is no value for "+this.selected.startDate)}
    }  
    else{console.log("There is no value for "+this.selected)}
}




public changeEventForHackrf(event){
    console.log("sdasaddsdsasdasdakmkdaljkdlfsjkdlsfjkdfsjljfdsnjfskdn")
  console.log(event.constructor.name)
  if(this.hackrfSelected){
    if(this.hackrfSelected.startDate){
      if(this.hackrfRangeStatus=="Current"){
        this.ngOnDestroyHackrf()
        this.srcForIperfGraph=this.sanitizationService.bypassSecurityTrustResourceUrl("http://10.0.50.100:3000/d-solo/QbgeMUAMz/wi-fi-test-house-hig-2-ghz-5-ghz?orgId=1&from=now-1h&to=now&refresh=10s&var-job=All&var-hostname=All&var-node=All&var-maxmount=%2Ffiles&var-name=&panelId=202")
        this.hackrf(null,null,null,null)
        this.subscriptionHackrf = interval(10000).subscribe(val => this.hackrfProcess(null));
        this.hackrfRangeStatus=""
        //this.colSizeOfRSSIWaterfall=90*90
        //console.log(this.selected+" for Current Status")
      }
else{
  
      //console.log(this.selected+" for Current Status")
      this.srcForIperfGraph=this.sanitizationService.bypassSecurityTrustResourceUrl("http://10.0.50.100:3000/d-solo/QbgeMUAMz/wi-fi-test-house-hig-2-ghz-5-ghz?orgId=1&from="+this.hackrfSelected.startDate.unix()*1000+"&to="+this.hackrfSelected.endDate.unix()*1000+"&refresh=10s&var-job=All&var-hostname=All&var-node=All&var-maxmount=%2Ffiles&var-name=&panelId=202")
     console.log(this.srcForIperfGraph)
      var startDate=this.hackrfSelected.startDate.unix()  * 1000000000
      var endDate=this.hackrfSelected.endDate.unix()  * 1000000000
      var difference= endDate-startDate
      console.log(difference)
      if(difference<=3600000000000){
      // if(difference==0){
      //   difference=5
      //   this.colSizeOfRSSIWaterfall=90*90
      // }
      // this.dateDifferenceForColSize=this.selected.endDate.unix()-this.selected.startDate.unix()
     this.ngOnDestroyHackrf()
     this.hackrf(startDate,endDate,null,null)
     this.hackrfRangeStatus=""
}
else{
  alert("Please choose 1 hour or less time range")
}
    // this.colSizeOfRSSIWaterfall=90*90*12*12
    }
  }
  else{console.log("There is no value for "+this.hackrfSelected.startDate)}
  }  
  else{console.log("There is no value for "+this.hackrfSelected)}
}








 






  private async channelInformation() {
    var response = await this.getApiResponseForChannel()
   // console.log(response.results[0].series)
    response.results[0].series.forEach(row => {
      var eachRow =row
      row.values.forEach(element => {
//console.log(eachRow)
var frequency:number=element[1]
var signal:number=element[2]
//console.log("Frequency is :"+element[1] +"and Channel is "+element[2])
this.channelMap.set(element[1],element[2])
      })
    })
  }



  private async penetrationHistoryLive(startDate:number,endDate:number,difference:number) {
   var channnelMap= this.channelMap
   var list= new Map();
   var listForColor= new Map();
   var listForIwdevInfo = new Map();
   var response
   this.uniqueValueForFrequency =new Set()
   if(startDate==null && this.destroyFlag==false){
     response = await this.getApiResponseForPenetrationLive();
   }
   else if (startDate!=null && startDate!=undefined && this.destroyFlag==true){
     console.log("Historical")
     if(this.highChartForRssi){
     this.highChartForRssi.destroy();
     }
     //this.highChartForRssi.showLoading()
     response = await this.getApiResponseForPenetration(startDate,endDate,difference);
     console.log("Response Size: " + response)
     //this.highChartForRssi.hideLoading()
   }

   else{

   
  }
    var series = [];
    try{
   if( (startDate==null && this.destroyFlag==false) || (startDate!=null && startDate!=undefined && this.destroyFlag==true) ){
    var number= response.results[0].series
    if(number){
    response.results[0].series.forEach(row => {
      var eachRow =row
      row.values.forEach(element => {
//console.log(eachRow)
var nodeIP = eachRow.tags.interfaceName;
var wifi=eachRow.tags.wifi
var signal:number=element[1]
var bitrate:number =element[3]
var frequency:number =element[2]
this.uniqueValueForFrequency.add(frequency)
var iwdex =new IwdevInfo(bitrate,frequency,null,null);
var time:number= new Date(element[0]).getTime()
var key =nodeIP+" "+wifi
var keyForIwdevInfo=nodeIP+" "+wifi+" "+time
listForIwdevInfo.set(keyForIwdevInfo,iwdex)
// var rowForSerie={data:[{x:nodeIP+wifi,y:this.generateData1(new Date(time).getTime(), signal)}]}
// series.push(rowForSerie)
// var obj ={x:new Date(time).getTime(),y:signal}
// var arr =  [];  
if(list.get(key))
{
  
  var row=list.get(key)
  var rowForColor=listForColor.get(key)
  row.push({x:new Date(time).getTime(),y:signal})
  list.set(key,row)
  rowForColor.push(this.rgb(signal))
  listForColor.set(key,rowForColor)
 
}
else{
  var data=[]
  var dataForColor=[]
  list.set(key,data)
  listForColor.set(key,dataForColor)
 
}
  


      })
    })
  }
  }
  } catch (error) {
    console.log(error.stack)
      
  }
 var series= []
 var index =0 ;
    list.forEach((value: any, key: string) => {

      value.forEach(element => {
        series.push([element.x,index,element.y])
      });
      
      
      index=index+1;
  });
  //console.log(" Size Of iwdev: "+ Array.from( listForIwdevInfo.keys() ))
  //series.push( [1603147680000, 50, 80])

  let keys = Array.from( list.keys() );
  
  if(startDate==null){   
    // console.log(this.dateDifferenceForColSize+" get differnce")
    //  if(this.dateDifferenceForColSize==null || this.dateDifferenceForColSize == undefined){
      this.colSizeOfRSSIWaterfall=130*130
    //    }
    //   else{
    //     this.colSizeOfRSSIWaterfall=90*90
    //     console.log("Hile Hurda "+this.dateDifferenceForColSize*0.025*this.dateDifferenceForColSize*0.025)
    //   }
   
  }
  else{
   
    if(this.dateDifferenceForColSize>86399){
      console.log(this.dateDifferenceForColSize +" fark budur")
    var sizeOfsquare=keys.length *1.80
    this.colSizeOfRSSIWaterfall=sizeOfsquare*sizeOfsquare*12*12
  }
  else{
    console.log(this.dateDifferenceForColSize +" fark budur")
    this.colSizeOfRSSIWaterfall=130*130
  }
  }

  var options:any= {

        chart: {
            type: 'heatmap',
            labels:{style:{color:"red"}},
            backgroundColor:"transparent",
          
        },
        // tooltip: {
        //   formatter: function () {
        //       return 'The value for <b>' + this.x +
        //           '</b> is <b>' + this.y + '</b>';
        //   }
        // },
        tooltip: {
          backgroundColor: '#FCFFC5',
          formatter: function () {
            var key=keys[this.point.y]+" "+this.point.x
            
            var iwdex:IwdevInfo=listForIwdevInfo.get(key)
            //console.log( iwdex.getFrequency()+" Mesud searching ")
            var date=new Date(this.point.x)
                 return 'Datetime is <b>' + date.toLocaleDateString()+" "+ date.toLocaleTimeString() +
                     '</b><br> RSSI value is <b>' + this.point.value + ' dbM</b>'+
                     '</b><br> Frequency value is <b>' + iwdex.getFrequency()/1000 + ' GHz</b>'+
                     '</b><br> Bitrate value is <b>' + iwdex.getBitrate() + ' MBit/s</b>'+
                     '</b><br> Channel value is <b>' +  channnelMap.get(iwdex.getFrequency())+'</b>';
             }
      },
        
        title: {
            text: 'Rssi Waterfall'
        },
        yAxis: {
          max:keys.length-1,
          min:0,
         // categories: ["10.0.100.20 wifi1","10.0.100.20 wifi2","10.0.100.20 wifi3","10.0.100.20 wifi4","10.0.100.20 wifi5","10.0.100.20 wifi6","10.0.100.20 wifi7","10.0.100.21 wifi1","10.0.100.21 wifi2","10.0.100.21 wifi3","10.0.100.21 wifi4","10.0.100.21 wifi5","10.0.100.21 wifi6","10.0.100.21 wifi7","10.0.100.22 wifi1","10.0.100.22 wifi2","10.0.100.22 wifi3","10.0.100.22 wifi4","10.0.100.22 wifi5","10.0.100.22 wifi6","10.0.100.22 wifi7","10.0.100.23 wifi1","10.0.100.23 wifi2","10.0.100.23 wifi3","10.0.100.23 wifi4","10.0.100.23 wifi5","10.0.100.23 wifi6","10.0.100.23 wifi7","10.0.100.24 wifi1","10.0.100.24 wifi2","10.0.100.24 wifi3","10.0.100.24 wifi4","10.0.100.24 wifi5","10.0.100.24 wifi6","10.0.100.24 wifi7","10.0.100.25 wifi1","10.0.100.25 wifi2","10.0.100.25 wifi3","10.0.100.25 wifi4","10.0.100.25 wifi5","10.0.100.25 wifi6","10.0.100.25 wifi7","10.0.100.26 wifi1","10.0.100.26 wifi2","10.0.100.26 wifi3","10.0.100.26 wifi4","10.0.100.26 wifi5","10.0.100.26 wifi6","10.0.100.26 wifi7","10.0.100.27 wifi1","10.0.100.27 wifi2","10.0.100.27 wifi3","10.0.100.27 wifi4","10.0.100.27 wifi5","10.0.100.27 wifi6","10.0.100.27 wifi7","10.0.100.28 wifi1","10.0.100.28 wifi2","10.0.100.28 wifi3","10.0.100.28 wifi4","10.0.100.28 wifi5","10.0.100.28 wifi6","10.0.100.28 wifi7"],
          categories:keys,
         title: null,
         reversed: true,
         labels:{         style: {
          color: '#fff',
          font: '13px Open Sans,sans-seri',
          fill: "#fff"
       }}
     },
        xAxis: {
          type: 'datetime'  ,
          labels: {
            formatter: function () {
              //console.log("Value is: "+value)
             // return   new Date(this.value).toLocaleTimeString();
             var date= new Date(this.value)
             
             return  date.toLocaleDateString()+  "        <br>"+date.toLocaleTimeString()
            },
            style: {
              color: '#fff',
              font: '13px Open Sans,sans-seri',
              fill: "#fff"
           }

          }
      },

        colorAxis: {
            dataClasses: [
              
              {from: 0, to: 0,color: ""+this.colorsHex[Math.round(this.colorsHex.length+0*2.5)]},
              {from: -1, to: -1,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-1*2.5)]},
                {from: -2, to: -2,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-2*2.5)]},
              {from: -3, to: -3,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-3*2.5)]},
                {from: -4, to: -4,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-4*2.5)]},
              {from: -5, to: -5,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-5*2.5)]},
                {from: -6, to: -6,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-6*2.5)]},
              {from: -7, to: -7,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-7*2.5)]},
                {from: -8, to: -8,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-8*2.5)]},
              {from: -9, to: -9,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-9*2.5)]},
                {from: -10, to: -10,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-10*2.5)]},
              {from: -11, to: -11,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-11*2.5)]},
                {from: -12, to: -12,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-12*2.5)]},
              {from: -13, to: -13,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-13*2.5)]},
                {from: -14, to: -14,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-14*2.5)]},
              {from: -15, to: -15,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-15*2.5)]},
                {from: -16, to: -16,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-16*2.5)]},
              {from: -17, to: -17,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-17*2.5)]},
                {from: -18, to: -18,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-18*2.5)]},
              {from: -19, to: -19,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-19*2.5)]},
                {from: -20, to: -20,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-20*2.5)]},
              {from: -21, to: -21,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-21*2.5)]},
                {from: -22, to: -22,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-22*2.5)]},
              {from: -23, to: -23,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-23*2.5)]},
                {from: -24, to: -24,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-24*2.5)]},
              {from: -25, to: -25,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-25*2.5)]},
                {from: -26, to: -26,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-26*2.5)]},
              {from: -27, to: -27,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-27*2.5)]},
                {from: -28, to: -28,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-28*2.5)]},
              {from: -29, to: -29,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-29*2.5)]},
                {from: -30, to: -30,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-30*2.5)]},
              {from: -31, to: -31,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-31*2.5)]},
                {from: -32, to: -32,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-32*2.5)]},
              {from: -33, to: -33,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-33*2.5)]},
                {from: -34, to: -34,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-34*2.5)]},
              {from: -35, to: -35,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-35*2.5)]},
                {from: -36, to: -36,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-36*2.5)]},
              {from: -37, to: -37,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-37*2.5)]},
                {from: -38, to: -38,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-38*2.5)]},
              {from: -39, to: -39,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-39*2.5)]},
                {from: -40, to: -40,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-40*2.5)]},
              {from: -41, to: -41,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-41*2.5)]},
                {from: -42, to: -42,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-42*2.5)]},
              {from: -43, to: -43,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-43*2.5)]},
                {from: -44, to: -44,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-44*2.5)]},
              {from: -45, to: -45,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-45*2.5)]},
                {from: -46, to: -46,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-46*2.5)]},
              {from: -47, to: -47,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-47*2.5)]},
                {from: -48, to: -48,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-48*2.5)]},
              {from: -49, to: -49,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-49*2.5)]},
                {from: -50, to: -50,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-50*2.5)]},
              {from: -51, to: -51,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-51*2.5)]},
                {from: -52, to: -52,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-52*2.5)]},
              {from: -53, to: -53,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-53*2.5)]},
                {from: -54, to: -54,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-54*2.5)]},
              {from: -55, to: -55,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-55*2.5)]},
                {from: -56, to: -56,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-56*2.5)]},
              {from: -57, to: -57,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-57*2.5)]},
                {from: -58, to: -58,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-58*2.5)]},
              {from: -59, to: -59,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-59*2.5)]},
                {from: -60, to: -60,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-60*2.5)]},
              {from: -61, to: -61,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-61*2.5)]},
                {from: -62, to: -62,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-62*2.5)]},
              {from: -63, to: -63,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-63*2.5)]},
                {from: -64, to: -64,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-64*2.5)]},
              {from: -65, to: -65,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-65*2.5)]},
                {from: -66, to: -66,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-66*2.5)]},
              {from: -67, to: -67,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-67*2.5)]},
                {from: -68, to: -68,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-68*2.5)]},
              {from: -69, to: -69,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-69*2.5)]},
                {from: -70, to: -70,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-70*2.5)]},
              {from: -71, to: -71,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-71*2.5)]},
                {from: -72, to: -72,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-72*2.5)]},
              {from: -73, to: -73,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-73*2.5)]},
                {from: -74, to: -74,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-74*2.5)]},
              {from: -75, to: -75,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-75*2.5)]},
                {from: -76, to: -76,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-76*2.5)]},
              {from: -77, to: -77,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-77*2.5)]},
                {from: -78, to: -78,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-78*2.5)]},
              {from: -79, to: -79,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-79*2.5)]},
                {from: -80, to: -80,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-80*2.5)]},
              {from: -81, to: -81,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-81*2.5)]},
                {from: -82, to: -82,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-82*2.5)]},
              {from: -83, to: -83,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-83*2.5)]},
                {from: -84, to: -84,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-84*2.5)]},
              {from: -85, to: -85,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-85*2.5)]},
                {from: -86, to: -86,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-86*2.5)]},
              {from: -87, to: -87,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-87*2.5)]},
                {from: -88, to: -88,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-88*2.5)]},
              {from: -89, to: -89,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-89*2.5)]},
                {from: -90, to: -90,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-90*2.5)]},
              {from: -91, to: -91,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-91*2.5)]},
                {from: -92, to: -92,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-92*2.5)]},
              {from: -93, to: -93,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-93*2.5)]},
                {from: -94, to: -94,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-94*2.5)]},
              {from: -95, to: -95,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-95*2.5)]},
                {from: -96, to: -96,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-96*2.5)]},
              {from: -97, to: -97,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-97*2.5)]},
                {from: -98, to: -98,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-98*2.5)]},
              {from: -99, to: -99,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-99*2.5)]}    
            ]
        },

        legend: {
          enabled:true,
             align: 'right',
            // layout: 'vertical',
            itemStyle:{ color:"white",font:"Verdana",fontSize:"14px"},
            labelFormatter: function(){ return this.name.split(".00")[0]}
             
            // margin: 0,
            // verticalAlign: 'top',
            // y: 25,
        },

        


        
        series: [{data:series,    borderWidth: 0,
         
          colsize: this.colSizeOfRSSIWaterfall,  turboThreshold:0,    tooltip: {
            nullFormat: 'Value is not available.',
            backgroundColor: '#fff',
            valueSuffix: ' dbM',
            headerFormat: '<small>{point.key}</small><table>',

        }}],
        lang:{noData:"No data for display"},
        plotOptions: {
          heatmap: {
            nullColor:"#E0E0E0"   // shared options for all heatmap series
          
        }
         
      }
  
  };

  //console.log(series)

  this.highChartForRssi=Highcharts.chart('heatmap', options);

  //this.heatMap(series)
   

  }


  hackrfProcess(event) {
    this.hackrf(null,null,null,event)
      }

  track() {
     this.penetrationHistoryLive(null,null,null)
      }


  ngOnDestroyRssi() {
    console.log("Unsubscribed")
    this.subscriptionRssi && this.subscriptionRssi.unsubscribe();
    this.destroyFlag=true
  }

  ngOnDestroyHackrf() {
    // For method 1
    this.subscriptionHackrf && this.subscriptionHackrf.unsubscribe();
  }

 







  public rgb(value:any):string{
    var val ='rgb(160,160,160)';
    if(value!=null){
    var color=this.colors.length+value*2.5
    val=""+this.colors[Math.round(color)]
  }

  
return val;
  }





  async getApiResponseForPenetration(startDatetime:number,endDatetime:number,difference:number) {
    this.spinner.show()
    console.log(this.spinner.show())
    return  await this.httpClient.get(ApiList.INFLUXDB+'/query?db=rssi&q= select Round(mean("Signal")) as Signal, mean("Frequency") as Frequency, mean("Bitrate") as Bitrate from rssi where time>='+startDatetime+' and time<='+endDatetime+' group by time('+difference+'s), wifi,interfaceName')
      .toPromise().then((res:HeatmapResults) => {
        this.spinner.hide()

return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        this.ngOnDestroyRssi()
        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
        this.spinner.hide()
      });
  }

  async getApiResponseForPenetrationLive() {
    
    return  await this.httpClient.get(ApiList.LIVE_WATERFALL_RSSI)
     //return  await this.httpClient.get('http://192.168.10.105:8086/query?db=rssi&q= select Round(mean("Signal")) as Signal, mean("Frequency") as Frequency, mean("Bitrate") as Bitrate   from rssi where  time>=1614299477000000000 and time<=1614385877000000000 group by time(15s), wifi,interfaceName') 
    .toPromise().then((res:HeatmapResults) => {
// this.aggregatedSum
// const temp_row = [
//   new Date(row.timestamp).getTime(),
//   row.value
// ];
// console.log(res[0]._id.time + " "+res[0].total )

return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        this.ngOnDestroyRssi()
        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }



  async getApiResponseForHackrfLive() {
    this.hackrfTableName='hackrf'+this.mtbf
    return  await this.httpClient.get('http://192.168.10.105:8086/query?db=rssi&q= select Round(mean("rssi")) as Signal, mean("startSignal") as startSignal, mean("endSignal") as endSignal   from '+this.hackrfTableName+'  where time>=now()-300000000000 group by time(2s),startSignal')
      .toPromise().then((res:HeatmapResults) => {
// this.aggregatedSum
// const temp_row = [
//   new Date(row.timestamp).getTime(),
//   row.value
// ];
// console.log(res[0]._id.time + " "+res[0].total )
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        this.ngOnDestroyHackrf()
        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }

  async getApiResponseForHackrfHistorical(startDatetime:number,endDatetime:number) {
    this.hackrfTableName='hackrf'+this.mtbf
    return  await this.httpClient.get('http://192.168.10.105:8086/query?db=rssi&q= select Round(mean("rssi")) as Signal, mean("startSignal") as startSignal, mean("endSignal") as endSignal   from '+this.hackrfTableName+'  where time>='+startDatetime+' and time<='+endDatetime+' group by time(2s),startSignal')
      .toPromise().then((res:HeatmapResults) => {
// this.aggregatedSum
// const temp_row = [
//   new Date(row.timestamp).getTime(),
//   row.value
// ];
// console.log(res[0]._id.time + " "+res[0].total )
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        this.ngOnDestroyHackrf()
        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }


  async getApiResponseForChannel() {
    return  await this.httpClient.get(ApiList.CHANNEL_LIST)
      .toPromise().then((res:HeatmapResults) => {
// this.aggregatedSum
// const temp_row = [
//   new Date(row.timestamp).getTime(),
//   row.value
// ];
// console.log(res[0]._id.time + " "+res[0].total )
return res;
      }).catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        console.log('An error occurred in Http Request'+err.message);
        throw err.error 
      });
  }

	public HotIronBluePalette()
	{
		var parts = this.init.split("\r\n");
    
    for (let index = 0; index < parts.length; index++) {
      var rgb =parts[index].split("	");
      this.colors[index]="rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")"
      this.colorsHex[index]=this.rgbToHex(rgb[0],rgb[1],rgb[2])
      
    }
//console.log(this.colorsHex)
  }



  public rgbToHex(r, g, b) {
   
    return "#" + this.hex(r) + this.hex(g) + this.hex(b);
   }
   
   public hex(x) {
    
     return isNaN(x) ? "00" : this.hexDigits[(x - x % 16) / 16] + this.hexDigits[x % 16];
    }
  
  public getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
public tooltip(event) {
  //console.log(event)
  //var pos = this.getMousePos(this.canvas, evt);
  //console.log("x coords: " + x + ", y coords: " + y);
 // console.log("Position X:{} Y:{}",pos.x,pos.y)
}










isInvalidDate(date: moment.Moment) {
 //console.log("date: "+date.unix()+" now: "+moment.now()+ "Diffrence: "+(date.unix()-(moment.now()/100)))
  return date.unix() > (moment.now()/1000) || date.unix()<(1601335690780287067/1000000000)
}

isCustomDate(date) {
  return  (
    date.weekday() === 0 ||
    date.weekday() === 6
  )  ? 'mycustomdate' : false;
}

 
rangeClicked(range) {
  console.log('[rangeClicked] range is : ', range.label);
  if(range.label=="Current"){
    console.log("Subscribed")
    this.rangeStatus="Current"
    this.destroyFlag=false
  }
}

hackrfRangeClicked(range) {
  console.log('[rangeClicked] range is : ', range.label);
  if(range.label=="Current"){
    console.log("Subscribed")
    this.hackrfRangeStatus="Current"
   // this.destroyFlag=false
  }
}











private async hackrf(startDate:number,endDate:number,difference:number,range:String) {
  var list= new Map();
  if(range){
  var currentRange=range[0]
}
  var response
  var allFlag=true
  if(startDate==null){
    response = await this.getApiResponseForHackrfLive();
    if(this.highChartForHackrf){
      this.highChartForHackrf.destroy();
      }
    
  }
  else if (startDate!=null && startDate!=undefined){
    console.log("Historical")
    if(this.highChartForHackrf){
    this.highChartForHackrf.destroy();
    }
    //this.highChartForRssi.showLoading()
    response = await this.getApiResponseForHackrfHistorical(startDate,endDate);
    console.log("Response Size: " + response)
    //this.highChartForRssi.hideLoading()
  }

  else{

  
 }

 //console.log(response)
 if(!range){
      allFlag=false 
}

   var series = [];
   var lastRssi;
//onsole.log(this.uniqueValueForFrequency)
   try{
  if( (startDate==null ) || (startDate!=null && startDate!=undefined ) ){
   if(response.results[0].series)
   {
    if(!range || range == "All"){
     //console.log(response.results[0].series)
    response.results[0].series.forEach(row => {
     var eachRow =row
     var name = eachRow.name
if(this.hackrfTableName == name){
  //console.log(this.hackrfTableName+"="+name)
     row.values.forEach(element => {
//console.log("Range is: "+range)
var startSignal = eachRow.tags.startSignal;
var signal:number=element[1]
if(!signal && this.countForHackrf<2){
  //console.log("LAst Signal is"+lastRssi)
signal = lastRssi
this.countForHackrf=this.countForHackrf+1
}else{
  this.countForHackrf=0
}
var time:number= new Date(element[0]).getTime()
var key =startSignal
lastRssi=signal
if(list.get(key))
{
 
 var row=list.get(key)
 row.push({x:new Date(time).getTime(),y:signal})
 list.set(key,row)


}
else{
 var data=[]
 list.set(key,data)

}
     







    //  else{
    //    console.log("Element 2 is: "+element[2])
    //   var startSignal = eachRow.tags.startSignal;
    //   var signal:number=element[1]
    //   var frequency:number =this.properValue(element[2])/1000000
    //   if(frequency=>range[0] && frequency<=range[1]){
    //   if(!signal && this.countForHackrf<2){
    //     //console.log("LAst Signal is"+lastRssi)
    //   signal = lastRssi
    //   this.countForHackrf=this.countForHackrf+1
    //   }else{
    //     this.countForHackrf=0
    //   }
    //   var time:number= new Date(element[0]).getTime()
    //   var key =startSignal
    //   lastRssi=signal
    //   if(list.get(key))
    //   {
       
    //    var row=list.get(key)
    //    row.push({x:new Date(time).getTime(),y:signal})
    //    list.set(key,row)
      
      
    //   }
    //   else{
    //    var data=[]
    //    list.set(key,data)
      
    //   }
    //  }
    // }






     })
    }
     
   })
    }

    else{
           //console.log(response.results[0].series)
    response.results[0].series.forEach(row => {
      var eachRow =row
      var eachRow =row
      var name = eachRow.name
      console.log(currentRange,this.rangeForCheck)
 if(this.hackrfTableName == name && currentRange == this.rangeForCheck){
      row.values.forEach(element => {
        //console.log("Element is: "+element)
        var startSignal = eachRow.tags.startSignal;
        var signal:number=element[1]
      
        var frequency:number =this.properValue(startSignal)/1000000

        //console.log("Frequency:"+frequency+" RAnge>= "+range[0]+" Range<= "+range[1])
        if(frequency>=parseInt(range[0]) && frequency<=parseInt(range[1])){
          //console.log("Frequency:"+frequency+" RAnge>= "+range[0]+" Range<= "+range[1])
        if(!signal && this.countForHackrf<2){
          //console.log("LAst Signal is"+lastRssi)
        signal = lastRssi
        this.countForHackrf=this.countForHackrf+1
        }else{
          this.countForHackrf=0
        }
        var time:number= new Date(element[0]).getTime()
        var key =startSignal
        lastRssi=signal
        if(list.get(key))
        {
         
         var row=list.get(key)
         row.push({x:new Date(time).getTime(),y:signal})
         list.set(key,row)
        
        
        }
        else{
         var data=[]
         list.set(key,data)
        
        }
       }
      

   
      
 
 
 
 
 
 
 
    
     //    console.log("Element 2 is: "+element[2])
     //   var startSignal = eachRow.tags.startSignal;
     //   var signal:number=element[1]
     //   var frequency:number =this.properValue(element[2])/1000000
     //   if(frequency=>range[0] && frequency<=range[1]){
     //   if(!signal && this.countForHackrf<2){
     //     //console.log("LAst Signal is"+lastRssi)
     //   signal = lastRssi
     //   this.countForHackrf=this.countForHackrf+1
     //   }else{
     //     this.countForHackrf=0
     //   }
     //   var time:number= new Date(element[0]).getTime()
     //   var key =startSignal
     //   lastRssi=signal
     //   if(list.get(key))
     //   {
        
     //    var row=list.get(key)
     //    row.push({x:new Date(time).getTime(),y:signal})
     //    list.set(key,row)
       
       
     //   }
     //   else{
     //    var data=[]
     //    list.set(key,data)
       
     //   }
     //  }
  
 
 
 
 
 
 
      })
    }
    })
    }



  
  }
 }
 } catch (error) {
   console.log(error.stack)
     
 }
var series= []
var index =0 ;
let keys = Array.from( list.keys() );
keys.sort(function (a, b) {
  return a-b;
});

//console.log(keys)

//sconsole.log(this.uniqueValueForFrequency)
var plotlines=[]
// plotlines.push(this.createPlotLine(20,"Mesud Burada"))
// plotlines.push(this.createPlotLine(40,"APo Burada"))
// plotlines.push(this.createPlotLine(60,"Dominic Burada"))
// plotlines.push(this.createPlotLine(80,"HAdi Burada"))
keys.forEach((value: any) => {
var x=value

  this.uniqueValueForFrequency.forEach((freq: string) => {
  if(freq){
    var frequency=Number(freq)/1000
    var value=  frequency.toFixed(2)
    var val= (Number(x)/1000000000).toFixed(2)

    if(value == val){
      
      console.log("Olduuuu",val,value,index,x,)
      var text= frequency+" GHZ"
      plotlines.push(this.createPlotLine(index,text))
      this.uniqueValueForFrequency.delete(freq)
    }
  }

  })
 
   //console.log(currentRange,range[0])
 var row=list.get(value)
  row.forEach(element => {
    series.push([element.x,index,element.y])
  });

  
  index=index+1;
});



//    list.forEach((value: any, key: string) => {

//      value.forEach(element => {
//        series.push([element.x,index,element.y])
//      });
     
     
//      index=index+1;
//  });
 //console.log(" Size Of iwdev: "+ Array.from( listForIwdevInfo.keys() ))
 //series.push( [1603147680000, 50, 80])

 
 let yaxis=[];
keys.forEach(element => {
  var ghz=element/1000000000
 // console.log("ghz is: "+ghz)

  yaxis.push(ghz+" GHZ")
});
 var options:any= {

       chart: {
           type: 'heatmap',
           height: this.heightForHackrf
       },

       // tooltip: {
       //   formatter: function () {
       //       return 'The value for <b>' + this.x +
       //           '</b> is <b>' + this.y + '</b>';
       //   }
       // },


    //    tooltip: {
    //      backgroundColor: '#FCFFC5',
    //      formatter: function () {
    //        var key=keys[this.point.y]+" "+this.point.x
    //        var iwdex:IwdevInfo=listForIwdevInfo.get(key)
    //        //console.log( iwdex.getFrequency()+" Mesud searching ")
    //        var date=new Date(this.point.x)
    //             return 'Datetime is <b>' + date.toLocaleDateString()+" "+ date.toLocaleTimeString() +
    //                 '</b><br> RSSI value is <b>' + this.point.value + ' dbM</b>'+
    //                 '</b><br> Frequency value is <b>' + iwdex.getFrequency()/1000 + ' GHz</b>'+
    //                 '</b><br> Bitrate value is <b>' + iwdex.getBitrate() + ' MBit/s</b>'+
    //                 '</b><br> Channel value is <b>' +  channnelMap.get(iwdex.getFrequency())+'</b>';
    //         }
    //  },
       
       title: {
           text: 'Signal Analyzer'
       },
       yAxis: {
         max:keys.length-1,
         min:0,
        // categories: ["10.0.100.20 wifi1","10.0.100.20 wifi2","10.0.100.20 wifi3","10.0.100.20 wifi4","10.0.100.20 wifi5","10.0.100.20 wifi6","10.0.100.20 wifi7","10.0.100.21 wifi1","10.0.100.21 wifi2","10.0.100.21 wifi3","10.0.100.21 wifi4","10.0.100.21 wifi5","10.0.100.21 wifi6","10.0.100.21 wifi7","10.0.100.22 wifi1","10.0.100.22 wifi2","10.0.100.22 wifi3","10.0.100.22 wifi4","10.0.100.22 wifi5","10.0.100.22 wifi6","10.0.100.22 wifi7","10.0.100.23 wifi1","10.0.100.23 wifi2","10.0.100.23 wifi3","10.0.100.23 wifi4","10.0.100.23 wifi5","10.0.100.23 wifi6","10.0.100.23 wifi7","10.0.100.24 wifi1","10.0.100.24 wifi2","10.0.100.24 wifi3","10.0.100.24 wifi4","10.0.100.24 wifi5","10.0.100.24 wifi6","10.0.100.24 wifi7","10.0.100.25 wifi1","10.0.100.25 wifi2","10.0.100.25 wifi3","10.0.100.25 wifi4","10.0.100.25 wifi5","10.0.100.25 wifi6","10.0.100.25 wifi7","10.0.100.26 wifi1","10.0.100.26 wifi2","10.0.100.26 wifi3","10.0.100.26 wifi4","10.0.100.26 wifi5","10.0.100.26 wifi6","10.0.100.26 wifi7","10.0.100.27 wifi1","10.0.100.27 wifi2","10.0.100.27 wifi3","10.0.100.27 wifi4","10.0.100.27 wifi5","10.0.100.27 wifi6","10.0.100.27 wifi7","10.0.100.28 wifi1","10.0.100.28 wifi2","10.0.100.28 wifi3","10.0.100.28 wifi4","10.0.100.28 wifi5","10.0.100.28 wifi6","10.0.100.28 wifi7"],
         categories:yaxis,
        title: null,
        reversed: true,
        plotLines: plotlines
      //   [{
      //     value: 0,
      //     color: '#FF0000',
      //     width: 10,
      //     height:10,
      //     zIndex: 4,
         
      //     label:{text: 'I am a label',
      //     align: 'left',
      //     y:5,
      //     style: {
      //       color: 'black',
      //       fontWeight: 'bold', 
      //       fontSize: '40px'
      //   }
      //     }
      // }]
    },
       xAxis: {
         type: 'datetime'  ,
         labels: {
           formatter: function () {
             //console.log("Value is: "+value)
            // return   new Date(this.value).toLocaleTimeString();
            var date= new Date(this.value)
            
            return  date.toLocaleDateString()+  "        <br>"+date.toLocaleTimeString()
           }
         },

     },

       colorAxis: {
           dataClasses: [
             
             {from: 0, to: 0,color: ""+this.colorsHex[Math.round(this.colorsHex.length+0*2.5)]},
             {from: -1, to: -1,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-1*2.5)]},
               {from: -2, to: -2,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-2*2.5)]},
             {from: -3, to: -3,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-3*2.5)]},
               {from: -4, to: -4,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-4*2.5)]},
             {from: -5, to: -5,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-5*2.5)]},
               {from: -6, to: -6,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-6*2.5)]},
             {from: -7, to: -7,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-7*2.5)]},
               {from: -8, to: -8,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-8*2.5)]},
             {from: -9, to: -9,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-9*2.5)]},
               {from: -10, to: -10,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-10*2.5)]},
             {from: -11, to: -11,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-11*2.5)]},
               {from: -12, to: -12,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-12*2.5)]},
             {from: -13, to: -13,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-13*2.5)]},
               {from: -14, to: -14,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-14*2.5)]},
             {from: -15, to: -15,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-15*2.5)]},
               {from: -16, to: -16,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-16*2.5)]},
             {from: -17, to: -17,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-17*2.5)]},
               {from: -18, to: -18,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-18*2.5)]},
             {from: -19, to: -19,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-19*2.5)]},
               {from: -20, to: -20,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-20*2.5)]},
             {from: -21, to: -21,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-21*2.5)]},
               {from: -22, to: -22,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-22*2.5)]},
             {from: -23, to: -23,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-23*2.5)]},
               {from: -24, to: -24,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-24*2.5)]},
             {from: -25, to: -25,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-25*2.5)]},
               {from: -26, to: -26,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-26*2.5)]},
             {from: -27, to: -27,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-27*2.5)]},
               {from: -28, to: -28,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-28*2.5)]},
             {from: -29, to: -29,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-29*2.5)]},
               {from: -30, to: -30,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-30*2.5)]},
             {from: -31, to: -31,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-31*2.5)]},
               {from: -32, to: -32,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-32*2.5)]},
             {from: -33, to: -33,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-33*2.5)]},
               {from: -34, to: -34,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-34*2.5)]},
             {from: -35, to: -35,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-35*2.5)]},
               {from: -36, to: -36,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-36*2.5)]},
             {from: -37, to: -37,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-37*2.5)]},
               {from: -38, to: -38,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-38*2.5)]},
             {from: -39, to: -39,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-39*2.5)]},
               {from: -40, to: -40,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-40*2.5)]},
             {from: -41, to: -41,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-41*2.5)]},
               {from: -42, to: -42,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-42*2.5)]},
             {from: -43, to: -43,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-43*2.5)]},
               {from: -44, to: -44,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-44*2.5)]},
             {from: -45, to: -45,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-45*2.5)]},
               {from: -46, to: -46,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-46*2.5)]},
             {from: -47, to: -47,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-47*2.5)]},
               {from: -48, to: -48,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-48*2.5)]},
             {from: -49, to: -49,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-49*2.5)]},
               {from: -50, to: -50,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-50*2.5)]},
             {from: -51, to: -51,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-51*2.5)]},
               {from: -52, to: -52,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-52*2.5)]},
             {from: -53, to: -53,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-53*2.5)]},
               {from: -54, to: -54,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-54*2.5)]},
             {from: -55, to: -55,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-55*2.5)]},
               {from: -56, to: -56,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-56*2.5)]},
             {from: -57, to: -57,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-57*2.5)]},
               {from: -58, to: -58,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-58*2.5)]},
             {from: -59, to: -59,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-59*2.5)]},
               {from: -60, to: -60,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-60*2.5)]},
             {from: -61, to: -61,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-61*2.5)]},
               {from: -62, to: -62,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-62*2.5)]},
             {from: -63, to: -63,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-63*2.5)]},
               {from: -64, to: -64,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-64*2.5)]},
             {from: -65, to: -65,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-65*2.5)]},
               {from: -66, to: -66,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-66*2.5)]},
             {from: -67, to: -67,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-67*2.5)]},
               {from: -68, to: -68,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-68*2.5)]},
             {from: -69, to: -69,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-69*2.5)]},
               {from: -70, to: -70,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-70*2.5)]},
             {from: -71, to: -71,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-71*2.5)]},
               {from: -72, to: -72,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-72*2.5)]},
             {from: -73, to: -73,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-73*2.5)]},
               {from: -74, to: -74,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-74*2.5)]},
             {from: -75, to: -75,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-75*2.5)]},
               {from: -76, to: -76,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-76*2.5)]},
             {from: -77, to: -77,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-77*2.5)]},
               {from: -78, to: -78,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-78*2.5)]},
             {from: -79, to: -79,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-79*2.5)]},
               {from: -80, to: -80,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-80*2.5)]},
             {from: -81, to: -81,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-81*2.5)]},
               {from: -82, to: -82,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-82*2.5)]},
             {from: -83, to: -83,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-83*2.5)]},
               {from: -84, to: -84,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-84*2.5)]},
             {from: -85, to: -85,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-85*2.5)]},
               {from: -86, to: -86,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-86*2.5)]},
             {from: -87, to: -87,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-87*2.5)]},
               {from: -88, to: -88,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-88*2.5)]},
             {from: -89, to: -89,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-89*2.5)]},
               {from: -90, to: -90,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-90*2.5)]},
             {from: -91, to: -91,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-91*2.5)]},
               {from: -92, to: -92,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-92*2.5)]},
             {from: -93, to: -93,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-93*2.5)]},
               {from: -94, to: -94,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-94*2.5)]},
             {from: -95, to: -95,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-95*2.5)]},
               {from: -96, to: -96,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-96*2.5)]},
             {from: -97, to: -97,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-97*2.5)]},
               {from: -98, to: -98,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-98*2.5)]},
             {from: -99, to: -99,color: ""+this.colorsHex[Math.round(this.colorsHex.length+-99*2.5)]}    
           ]
       },

       legend: {
          enabled:true,
        align: 'right',
        layout: 'vertical'
       },


       
       series: [{data:series,    borderWidth: 0,                dataGrouping: {
        enabled: false
    },
    pointWidth: '100%',
    turboThreshold: 0,
        
         //colsize:31.6*31.6}],
         colsize:49.8*49.8},],
    lang: {
        noData: "No data to display"
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '45px',
            color: '#303030'
        }
    },
       plotOptions: {
         heatmap: {
           nullColor:"#E0E0E0"   // shared options for all heatmap series
         
       }
        
     }
 
 };

// console.log(series)

 this.highChartForHackrf=Highcharts.chart('hackrf', options);

 //this.heatMap(series)
  

 }

 
public showHackrfResults(event){
 var value= event.target.value
 this.ngOnDestroyHackrf()
 //console.log("Value is: "+value)
 if(value == 'All'){
  this.hackrf(null,null,null,null)
  this.subscriptionHackrf = this.sourceHackrf.subscribe(val => this.hackrfProcess(null));
  this.heightForHackrf='2000px'
  
 }
 else{
  var range = value.split(':')
  this.rangeForCheck=range[0]
  this.hackrf(null,null,null,range)
  this.subscriptionHackrf = this.sourceHackrf.subscribe(val => this.hackrfProcess(range));
  if(value == "5000:6000"){
    this.heightForHackrf='1800px'
  }
  else if(value == "550:600"){
    this.heightForHackrf='1000px'
  }
  else{
    this.heightForHackrf='1050px'
  }
  //console.log(range[0],range[1])
 }
 
 
}

public specifyMTBF(event){
  var value= event.target.value 
  if(value== this.mtbfOptions[0]){
    alert("Please Choose Valid Option")
  }else{
    this.mtbf=value
   // this.ngOnDestroyHackrf()
  }
}


public getlength(number) {
  return number.toString().length;
}

public properValue(number){
  var num =this.getlength(number)
  return number
}


public stopHackrfRefreshing(){
  this.ngOnDestroyHackrf();
  alert(" Live Data Stopped")
}

public createPlotLine(value:number,text:String)
{
  var x= {
    value: value,
    color: 'Yellow',
    width: 3,
    zIndex: 4,
  //  x:200,
    label:{text: text,
    align: 'left',
     x:50,
    style: {
      color: 'White',
      fontWeight: 'bold', 
      fontSize: '20px',
      
  }
    }
}
return x


}


}
