import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {  HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Results } from '../../../../service/InfluxDBResults';
import { interval, Subscription } from 'rxjs';
import { HeatmapResults } from 'src/service/InfluxDBHeatmapHistory';
import { IwdevInfo } from 'src/service/IwdevInfo';
import { ApiList } from 'src/app/utils/data/apiList.data';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  //encapsulation: ViewEncapsulation.None
  
})
export class HeatmapComponent implements OnInit {

  colors:String[]=[];
  colorsHex:String[]=[];
  legendNumbers = new Map();
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
canvas: ElementRef<HTMLCanvasElement>;
@ViewChild('canvasForUpstairs', { static: true })
canvasForUpstairs: ElementRef<HTMLCanvasElement>;
@ViewChild('canvasForDownstairs', { static: true })
canvasForDownstairs: ElementRef<HTMLCanvasElement>;
@ViewChild('canvasForGarage', { static: true })
canvasForGarage: ElementRef<HTMLCanvasElement>;
@ViewChild('tip', { static: true }) 
tipCanvas: ElementRef<HTMLCanvasElement>;
@ViewChild('tipKitchen', { static: true }) 
tipKitchenCanvas: ElementRef<HTMLCanvasElement>;
@ViewChild('tipForUpstairs', { static: true }) 
tipUpstairsCanvas: ElementRef<HTMLCanvasElement>;

private ctx: CanvasRenderingContext2D
private ctxForGarage: CanvasRenderingContext2D
private ctxForUpstairs: CanvasRenderingContext2D
private ctxForDownstairs: CanvasRenderingContext2D
subscription:Subscription
private imageObj = new Image();
private imageObjForGarage = new Image();
private imageObjForUpstairs = new Image();
private imageObjForDownstairs = new Image();
public channelMap =new Map();
public tooltipDetails = new Map();
public dataForUpstairs={values:[{
  x: 370,
  y: 495,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.230"
}, {
x: 310,
y: 555,
r:9,
wlan:"wlan2",
ip:"192.168.10.230"
}, {
x: 370,
y: 555,
r:9,
wlan:"wlan3",
ip:"192.168.10.230"
}, {
x: 430,
y: 555,
r:9,
wlan:"wlan4",
ip:"192.168.10.230"
}, {
x: 310,
y: 615,
r:9,
wlan:"wlan5",
ip:"192.168.10.230"
}, {
x: 370,
y: 615,
r:9,
wlan:"wlan6",
ip:"192.168.10.230"
}, {
x: 430,
y: 615,
r:9,
wlan:"wlan7",
ip:"192.168.10.230"
}
  ,{
  x: 540,
  y: 120,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.190"
}, {
x: 600,
y: 120,
r:9,
wlan:"wlan2",
ip:"192.168.10.190"
}, {
x: 540,
y: 175,
r:9,
wlan:"wlan3",
ip:"192.168.10.190"
}, {
x: 600,
y: 175,
r:9,
wlan:"wlan4",
ip:"192.168.10.190"
}, {
x: 660,
y: 175,
r:9,
wlan:"wlan5",
ip:"192.168.10.190"
}, {
x: 540,
y: 230,
r:9,
wlan:"wlan6",
ip:"192.168.10.190"
}, {
x: 600,
y: 230,
r:9,
wlan:"wlan7",
ip:"192.168.10.190"
},{
  x: 80,
  y: 390,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.170"
}, {
x: 140,
y: 390,
r:9,
wlan:"wlan2",
ip:"192.168.10.170"
}, {
x: 80,
y: 450,
r:9,
wlan:"wlan3",
ip:"192.168.10.170"
}, {
x: 140,
y: 450,
r:9,
wlan:"wlan4",
ip:"192.168.10.170"
}, {
x: 200,
y: 450,
r:9,
wlan:"wlan5",
ip:"192.168.10.170"
}, {
x: 80,
y: 510,
r:9,
wlan:"wlan6",
ip:"192.168.10.170"
}, {
x: 140,
y: 510,
r:9,
wlan:"wlan7",
ip:"192.168.10.170"
},{
  x: 540,
  y: 630,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.210"
}, {
x: 6000,
y: 630,
r:9,
wlan:"wlan2",
ip:"192.168.10.210"
}, {
x: 540,
y: 690,
r:9,
wlan:"wlan3",
ip:"192.168.10.210"
}, {
x: 600,
y: 690,
r:9,
wlan:"wlan4",
ip:"192.168.10.210"
}, {
x: 660,
y: 690,
r:9,
wlan:"wlan5",
ip:"192.168.10.210"
}, {
x: 540,
y: 750,
r:9,
wlan:"wlan6",
ip:"192.168.10.210"
}, {
x: 600,
y: 750,
r:9,
wlan:"wlan7",
ip:"192.168.10.210"
},{
  x: 1360,
  y: 325,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.130"
}, {
x: 1360,
y: 385,
r:9,
wlan:"wlan2",
ip:"192.168.10.130"
}, {
x: 1360,
y: 445,
r:9,
wlan:"wlan3",
ip:"192.168.10.130"
}, {
x: 1300,
y: 325,
r:9,
wlan:"wlan4",
ip:"192.168.10.130"
}, {
x: 1300,
y: 385,
r:9,
wlan:"wlan5",
ip:"192.168.10.130"
}, {
x: 1300,
y: 445,
r:9,
wlan:"wlan6",
ip:"192.168.10.130"
}, {
x: 1240,
y: 385,
r:9,
wlan:"wlan7",
ip:"192.168.10.130"
},{
  x: 680,
  y: 450,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.180"
}, {
x: 740,
y: 390,
r:9,
wlan:"wlan2",
ip:"192.168.10.180"
}, {
x: 740,
y: 450,
r:9,
wlan:"wlan3",
ip:"192.168.10.180"
}, {
x: 800,
y: 390,
r:9,
wlan:"wlan4",
ip:"192.168.10.180"
}, {
x: 800,
y: 450,
r:9,
wlan:"wlan5",
ip:"192.168.10.180"
}, {
x: 860,
y: 390,
r:9,
wlan:"wlan6",
ip:"192.168.10.180"
}, {
x: 860,
y: 450,
r:9,
wlan:"wlan7",
ip:"192.168.10.180"
}
]}
public dataForKitchen={values:[{
  x: 450,
  y: 108,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.220"
}, {
x: 510,
y: 108,
r:9,
wlan:"wlan2",
ip:"192.168.10.220"
}, {
x: 570,
y: 108,
r:9,
wlan:"wlan3",
ip:"192.168.10.220"
}, {
x: 450,
y: 168,
r:9,
wlan:"wlan4",
ip:"192.168.10.220"
}, {
x: 510,
y: 168,
r:9,
wlan:"wlan5",
ip:"192.168.10.220"
}, {
x: 570,
y: 168,
r:9,
wlan:"wlan6",
ip:"192.168.10.220"
}, {
x: 510,
y: 228,
r:9,
wlan:"wlan7",
ip:"192.168.10.220"
},{
  x: 880,
  y: 240,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.240"
}, {
x: 940,
y: 180,
r:9,
wlan:"wlan2",
ip:"192.168.10.240"
}, {
x: 940,
y: 240,
r:9,
wlan:"wlan3",
ip:"192.168.10.240"
}, {
x: 940,
y: 300,
r:9,
wlan:"wlan4",
ip:"192.168.10.240"
}, {
x: 1010,
y: 180,
r:9,
wlan:"wlan5",
ip:"192.168.10.240"
}, {
x: 1010,
y: 240,
r:9,
wlan:"wlan6",
ip:"192.168.10.240"
}, {
x: 1010,
y: 300,
r:9,
wlan:"wlan7",
ip:"192.168.10.240"
}]}
public data = {
  values: [{
    x: 1055,
    y: 100,
    r:9,
    wlan:"wlan1",
    ip:"192.168.10.120"
}, {
  x: 1115,
  y: 100,
  r:9,
  wlan:"wlan2",
  ip:"192.168.10.120"
}, {
x: 1055,
y: 155,
r:9,
wlan:"wlan3",
ip:"192.168.10.120"
}, {
x: 1115,
y: 155,
r:9,
wlan:"wlan4",
ip:"192.168.10.120"
}, {
x: 1175,
y: 155,
r:9,
wlan:"wlan5",
ip:"192.168.10.120"
}, {
x: 1035,
y: 210,
r:9,
wlan:"wlan6",
ip:"192.168.10.120"
}, {
x: 1115,
y: 210,
r:9,
wlan:"wlan7",
ip:"192.168.10.120"
},{     x: 815,
  y: 500,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.150"
}, {
x: 875,
y: 500,
r:9,
wlan:"wlan2",
ip:"192.168.10.150"
}, {
x: 815,
y: 555,
r:9,
wlan:"wlan3",
ip:"192.168.10.150"
}, {
x: 875,
y: 555,
r:9,
wlan:"wlan4",
ip:"192.168.10.150"
}, {
x: 935,
y: 555,
r:9,
wlan:"wlan5",
ip:"192.168.10.150"
}, {
x: 815,
y: 610,
r:9,
wlan:"wlan6",
ip:"192.168.10.150"
}, {
x: 875,
y: 610,
r:9,
wlan:"wlan7",
ip:"192.168.10.150"
},{     x: 740,
  y: 100,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.160"
}, {
x: 800,
y: 100,
r:9,
wlan:"wlan2",
ip:"192.168.10.160"
}, {
x: 740,
y: 155,
r:9,
wlan:"wlan3",
ip:"192.168.10.160"
}, {
x: 800,
y: 155,
r:9,
wlan:"wlan4",
ip:"192.168.10.160"
}, {
x: 860,
y: 155,
r:9,
wlan:"wlan5",
ip:"192.168.10.160"
}, {
x: 740,
y: 210,
r:9,
wlan:"wlan6",
ip:"192.168.10.160"
}, {
x: 800,
y: 210,
r:9,
wlan:"wlan7",
ip:"192.168.10.160"
},{     x: 765,
      y: 370,
      r:9,
      wlan:"wlan1",
      ip:"192.168.10.110"
  }, {
    x: 410,
    y: 430,
    r:9,
    wlan:"wlan2",
    ip:"192.168.10.110"
}, {
  x: 470,
  y: 430,
  r:9,
  wlan:"wlan3",
  ip:"192.168.10.110"
}, {
  x: 530,
  y: 430,
  r:9,
  wlan:"wlan4",
  ip:"192.168.10.110"
}, {
  x: 410,
  y: 490,
  r:9,
  wlan:"wlan5",
  ip:"192.168.10.110"
}, {
  x: 470,
  y: 490,
  r:9,
  wlan:"wlan6",
  ip:"192.168.10.110"
}, {
  x: 530,
  y: 490,
  r:9,
  wlan:"wlan7",
  ip:"192.168.10.110"
},{     x: 470,
  y: 370,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.110"
}, {
x: 410,
y: 430,
r:9,
wlan:"wlan2",
ip:"192.168.10.110"
}, {
x: 470,
y: 430,
r:9,
wlan:"wlan3",
ip:"192.168.10.110"
}, {
x: 530,
y: 430,
r:9,
wlan:"wlan4",
ip:"192.168.10.110"
}, {
x: 410,
y: 490,
r:9,
wlan:"wlan5",
ip:"192.168.10.110"
}, {
x: 470,
y: 490,
r:9,
wlan:"wlan6",
ip:"192.168.10.110"
}, {
x: 530,
y: 490,
r:9,
wlan:"wlan7",
ip:"192.168.10.110"
},{
  x: 40,
  y: 410,
  r:9,
  wlan:"wlan1",
  ip:"192.168.10.140"
}, {
x: 40,
y: 480,
r:9,
wlan:"wlan2",
ip:"192.168.10.140"
}, {
x: 100,
y: 480,
r:9,
wlan:"wlan3",
ip:"192.168.10.140"
}, {
x: 160,
y: 480,
r:9,
wlan:"wlan4",
ip:"192.168.10.140"
}, {
x: 40,
y: 540,
r:9,
wlan:"wlan5",
ip:"192.168.10.140"
}, {
x: 100,
y: 540,
r:9,
wlan:"wlan6",
ip:"192.168.10.140"
}, {
x: 160,
y: 540,
r:9,
wlan:"wlan7",
ip:"192.168.10.140"
}]
};

public tipCtx : CanvasRenderingContext2D 
public tipCtxKitchen : CanvasRenderingContext2D 
public tipCtxUpstairs : CanvasRenderingContext2D 
  constructor(private httpClient: HttpClient) {
   
  }

  public scaleToFit(img,canvas,ctx){
    // get the scale
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    var x = (canvas.width / 2) - (img.width / 2) * scale;
    var y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

  ngOnInit(): void {
    
    this.HotIronBluePalette()
    this.fillLegendNumbers();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctxForUpstairs = this.canvasForUpstairs.nativeElement.getContext('2d');
    this.channelInformation();

    this.ctxForDownstairs = this.canvasForDownstairs.nativeElement.getContext('2d');
    this.ctxForGarage = this.canvasForGarage.nativeElement.getContext('2d');

    this.imageObj.src = '../../../../assets/img/kitchen.png';
    this.imageObjForGarage.src = '../../../../assets/img/garage.png';
    this.imageObjForUpstairs.src = '../../../../assets/img/upstairs.png';
    this.imageObjForDownstairs.src = '../../../../assets/img/downstairs.png';



    this.imageObjForUpstairs.onload = () => {
      
      this.ctxForUpstairs.drawImage(this.imageObjForUpstairs, 0, 0)
    }
    
   

       this.imageObjForDownstairs.onload = () => {
        this.ctxForDownstairs.drawImage(this.imageObjForDownstairs, 0, 0)
        }

        this.imageObjForGarage.onload = () => {
          this.ctxForGarage.drawImage(this.imageObjForGarage, 0, 0)
          }

          this.imageObj.onload = () => {
    this.ctx.drawImage(this.imageObj, 0, 0)


    }

    

    
    const source = interval(5000);
   
    
    this.source();
    this.subscription = source.subscribe(val => this.opensnack());






  }


  private fillLegendNumbers() {
    this.legendNumbers.set(5, "-   0 dbM");
    this.legendNumbers.set(25, "- -10 dbM");
    this.legendNumbers.set(50, "- -20 dbM");
    this.legendNumbers.set(75, "- -30 dbM");
    this.legendNumbers.set(100, "- -40 dbM");
    this.legendNumbers.set(125, "- -50 dbM");
    this.legendNumbers.set(150, "- -60 dbM");
    this.legendNumbers.set(175, "- -70 dbM");
    this.legendNumbers.set(200, "- -80 dbM");
    this.legendNumbers.set(228, "- -90 dbM");
    this.legendNumbers.set(255, "- -99 dbM");
  }

  opensnack() {
    this.source();
      }

      private async source() {
        var  node110 = new Map();
        var  node120 = new Map();
        var  node130 = new Map();
        var  node140 = new Map();
        var  node150 = new Map();
        var  node160 = new Map();
        var  node170 = new Map();
        var  node180 = new Map();
        var  node190 = new Map();
        var  node210 = new Map();
        var  node220 = new Map();
        var  node230 = new Map();
        var  node240 = new Map();
    
    
    
    
        var response = await this.getApiResponseThroughput();
    
    
        //console.log(response)
    //console.log(response)
    if(response){
      this.tooltipDetails=new Map();
      var number= response.results[0].series
      if(number){
        response.results[0].series.forEach(row => {
         
          row.values.forEach(element => {
    var nodeIP = element[1];
    var wifi=row.tags.wifi
    var signal=element[2]
    var bitrate= element[3]
    var frequency= element[4]
    var ssid=element[5]
    var key= nodeIP+wifi
   var channel= this.channelMap.get(frequency)
console.log(channel)
    var iwdex:IwdevInfo=new IwdevInfo(bitrate,frequency,ssid,channel)
    this.tooltipDetails.set(key,iwdex)
    if(nodeIP=="192.168.10.110")
    {
      node110.set(wifi,signal)
      
      
    
    }
    else if(nodeIP=="192.168.10.120")
    {
      node120.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.130")
    { node130.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.140")
    { node140.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.150")
    { node150.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.160")
    { node160.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.170")
    { node170.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.180")
    { node180.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.190")
    {node190.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.210")
    {node210.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.220")
    {node220.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.230")
    {node230.set(wifi,signal)
    
    }
    else if(nodeIP=="192.168.10.240")
    {node240.set(wifi,signal)
    
    }
    
    else{
      //console.log("Invalid Ip Address: "+nodeIP)
    }
    
          });
    
     
        });
      }
        
    
        console.log("buraya kadar geldi")
        this.ctx = this.canvas.nativeElement.getContext('2d');
        var imageObj = new Image();
        imageObj.src = '../../../assets/img/kitchen.png';
        this.ctxForDownstairs = this.canvasForDownstairs.nativeElement.getContext('2d');
        var imageObjForDownstairs = new Image();
        imageObjForDownstairs.src = '../../../../assets/img/downstairs.png';
        this.ctxForUpstairs = this.canvasForUpstairs.nativeElement.getContext('2d');
        var imageObjForUpstairs = new Image();
        imageObjForUpstairs.src = '../../../../assets/img/upstairs.png';

        imageObjForUpstairs.onload = () => {
          this.ctxForUpstairs.drawImage(this.imageObjForUpstairs, 0, 0)
          this.drawBar( 1450, 55, 16, 256, this.ctxForUpstairs);
          for (let index = 0; index < this.colors.length; index++) {
            var element = this.colors[this.colors.length-index];
            this.drawSquareForBar(""+element,1450, 54+index, 16, 1,index,this.ctxForUpstairs)
  
           }
           
          // this.node120Draw(node120,this.ctxForUpstairs);
          this.node230Draw(node230,this.ctxForUpstairs);
            this.node190Draw(node190,this.ctxForUpstairs);
            this.node170Draw(node170,this.ctxForUpstairs);
            this.node210Draw(node210,this.ctxForUpstairs);
            this.node130Draw(node130,this.ctxForUpstairs);
            this.node180Draw(node180,this.ctxForUpstairs)
         // this.node110Draw(node110,this.ctxForUpstairs);
          //  this.node140Draw(node140,this.ctxForUpstairs);
          }     
       
        imageObjForDownstairs.onload = () => {
        this.ctxForDownstairs.drawImage(this.imageObjForDownstairs, 0, 0)
        this.drawBar( 1350, 55, 16, 256, this.ctxForDownstairs);
        for (let index = 0; index < this.colors.length; index++) {
          var element = this.colors[this.colors.length-index];
          this.drawSquareForBar(""+element,1350, 54+index, 16, 1,index,this.ctxForDownstairs)

         }
         
         this.node120Draw(node120,this.ctxForDownstairs);
         this.node150Draw(node150,this.ctxForDownstairs);
         this.node160Draw(node160,this.ctxForDownstairs);
         this.node110Draw(node110,this.ctxForDownstairs);
         this.node140Draw(node140,this.ctxForDownstairs);
        }
    
        imageObj.onload = () => {
          // console.log("Buraya kadar geldi")
           this.ctx.drawImage(this.imageObj, 0, 0)
           this.drawBar( 1350, 55, 16, 256, this.ctx);
           for (let index = 0; index < this.colors.length; index++) {
             var element = this.colors[this.colors.length-index];
             this.drawSquareForBar(""+element,1350, 54+index, 16, 1,index,this.ctx)
  
            }
            this.node220Draw(node220,this.ctx);
            this.node240Draw(node240,this.ctx);
        }
      }
      else{
        window.alert("No data comes from Database")
      }
      }

      private bedrom1_2(bedroom1_2:Map<any,any>) {

    

        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan4"), 150, 32, 86, 45,"wlan4");
        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan2"), 150, 77, 86, 45,"wlan2");
        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan3"), 50, 122, 86, 45,"wlan3");
    
        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan7"), 136, 32, 86, 45,"wwlan7");
        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan6"), 136, 77, 86, 45,"wlan6");
        this.drawSmallSquare(this.checkSignal(bedroom1_2,"wlan5"), 136, 122, 86, 45,"wlan5");
        
        this.drawLastSquare(this.checkSignal(bedroom1_2,"wlan1"), 150, 167, 172, 45,"wlan1");
      }
    
      private bedRoom1_1(bedRoom1_1:Map<any,any>) {
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan1"), 65, 32, 83, 33,"wlan1");
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan2"), 65, 65, 83, 33,"wlan2");
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan7"), 65, 98, 83, 33,"wlan7");
    
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan3"), 168, 32, 83, 33,"wlan3");
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan6"), 168, 65, 83, 33,"wlan6");
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan5"), 168, 98, 83, 33,"wlan5");
    
        this.drawSquareForEmpty(this.checkSignal(bedRoom1_1,"wlan4"), 151, 32, 83, 33);
        this.drawSmallSquare(this.checkSignal(bedRoom1_1,"wlan4"), 151, 65, 83, 33,"wlan4");
        this.drawSquareForEmpty(this.checkSignal(bedRoom1_1,"wlan4"), 151, 98, 83, 33);
      }
    
      private node120Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
        // this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 135, 53, 49, 33, 10);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 1055, 100, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 1115, 100, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 1055, 155, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 1115, 155, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 1175, 155, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 1055, 210, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 1115, 210, 40, 40, 9);

      }

      private node160Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 740, 100, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 800, 100, 40, 40, 9);
 
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 740, 155, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 800, 155, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 860, 155, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 740, 210, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 800, 210, 40, 40, 9);

      }

      private node190Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 540, 120, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 600, 120, 40, 40, 9);
 
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 540, 175, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 600, 175, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 660, 175, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 540, 230, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 600, 230, 40, 40, 9);3
      }

      
      private node210Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 540, 630, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 600, 630, 40, 40, 9);
 
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 540, 690, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 600, 690, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 660, 690, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 540, 750, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 600, 750, 40, 40, 9);

      }

      private node170Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 80, 390, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 140,390, 40, 40, 9);
 
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 80,  450, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 140, 450, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 200, 450, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 80,  510, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 140, 510, 40, 40, 9);

      }

      private node110Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 470, 370, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 410, 430, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 470, 430, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 530, 430, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 410, 490, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 470, 490, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 530, 490, 40, 40, 9);

      }

      private node240Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 880, 240, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 940, 180, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 940, 240, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 940, 300, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 1010, 180, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 1010, 240, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 1010, 300, 40, 40, 9);

      }

      private node140Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
      

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 40, 410, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 40, 480, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 100, 480, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 160, 480, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 40, 540, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 100, 540, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 160, 540, 40, 40, 9);

      }

      private node150Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
 


        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 815, 500, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 875, 500, 40, 40, 9);

        
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 815, 555, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 875, 555, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 935, 555, 40, 40, 9);
    
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 815, 610, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 875, 610, 40, 40, 9);
      }

      private node230Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
 

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 370, 495, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 310, 555, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 370, 555, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 430, 555, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 310, 615, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 370, 615, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 430, 615, 40, 40, 9);
      }

      private node130Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
 

   
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 1360, 325, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 1360, 385, 40, 40, 9);

      
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 1360, 445, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 1300, 325, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 1300, 385, 40, 40, 9);
    
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 1300, 445, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 1240, 385, 40, 40, 9);
      }

      private node180Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
 

   
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 680, 450, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 740, 390, 40, 40, 9);

        
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 740, 450, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 800, 390, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 800, 450, 40, 40, 9);
    
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 860, 390, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 860, 450, 40, 40, 9);
      }

      private node220Draw(bedRoom2:Map<any,any>,ctx:CanvasRenderingContext2D) {
      
        // this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 135, 53, 49, 33, 10);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan1"),"wlan1", 450, 108, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan2"),"wlan2", 510, 108, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan3"),"wlan3", 570, 108, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan4"),"wlan2", 450, 168, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan5"),"wlan1", 510, 168, 40, 40, 9);

        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan6"),"wlan3", 570, 168, 40, 40, 9);
        this.roundedRect(ctx,this.checkSignal(bedRoom2,"wlan7"),"wlan2", 510, 228, 40, 40, 9);

      }
    
    
      private kitchen(kitchen1:Map<any,any>,kitchen2:Map<any,any>,ctx:CanvasRenderingContext2D) {
           
    //////Kitchen 1
        this.drawSquare1(this.checkSignal(kitchen2,"wifi2"), 685, 620, 83, 55,"wifi2",ctx);
        this.drawSquare1(this.checkSignal(kitchen2,"wifi5"), 685, 675, 83, 55,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(kitchen2,"wifi7"), 685, 725, 83, 55,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(kitchen2,"wifi4"), 768, 620, 83, 55,"wifi4",ctx);
        this.drawSquare1(this.checkSignal(kitchen2,"wifi6"), 768, 675, 83, 55,"wifi6",ctx);
        //
    
        this.drawSquare1(this.checkSignal(kitchen2,"wifi1"), 851, 620, 83, 55,"wifi1",ctx);
        this.drawSquare1(this.checkSignal(kitchen2,"wifi3"), 851, 675, 83, 55,"wifi3",ctx);
        //this.drawSquare(0.75, 851, 725, 83, 55);
        //////Kitchen 1
    
        //////Kitchen 2
        this.drawSquare1(this.checkSignal(kitchen1,"wifi2"), 934, 590, 83, 55,"wifi2",ctx);
        this.drawSquare1(this.checkSignal(kitchen1,"wifi1"), 934, 645, 83, 55,"wifi1",ctx);
        this.drawSquare1(this.checkSignal(kitchen1,"wifi4"), 934, 700, 83, 55,"wifi4",ctx);
    
        this.drawSquare1(this.checkSignal(kitchen1,"wifi7"), 1017, 590, 83, 55,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(kitchen1,"wifi5"), 1017, 645, 83, 55,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(kitchen1,"wifi3"), 1017, 700, 83, 55,"wifi3",ctx);
    
        // this.drawSquare(0.56, 1100, 590, 90, 55);
        this.drawSquare1(this.checkSignal(kitchen1,"wifi6"), 1100, 645, 90, 55,"wifi6",ctx);
        //this.drawSquare(0.75, 1100, 700, 90, 55);
    //////Kitchen 2
      }
    
      private checkSignal(map: Map<any, any>,wifi:String) {
    
        if (map.get(wifi)) {
          return map.get(wifi);
        }
        else {
          return null
        }
      }
    
      private winterGarden(winterGarden:Map<any,any>,ctx:CanvasRenderingContext2D) {
        this.drawSquare1(this.checkSignal(winterGarden,"wifi5"), 345, 600, 83, 105,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(winterGarden,"wifi3"), 345, 705, 83, 105,"wifi3",ctx);
        this.drawSquare1(this.checkSignal(winterGarden,"wifi1"), 345, 810, 83, 105,"wifi1",ctx);
    
        this.drawSquare1(this.checkSignal(winterGarden,"wifi6"), 427, 600, 83, 105,"wifi6",ctx);
    
        this.drawSquare1(this.checkSignal(winterGarden,"wifi4"), 427, 810, 83, 105,"wifi4",ctx);
    
    
    
        this.drawSquareForEmpty(this.checkSignal(winterGarden,"wifi7"), 510, 600, 83, 105);
        this.drawSquare1(this.checkSignal(winterGarden,"wifi7"), 510, 705, 83, 105,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(winterGarden,"wifi2"), 510, 810, 83, 105,"wifi2",ctx);
      }
    
      private livingRoom(livingroom1:Map<any,any>,livingroom2:Map<any,any>,livingroom3:Map<any,any>,ctx:CanvasRenderingContext2D) {
        
        this.drawSquare1(this.checkSignal(livingroom1,"wifi7"), 5, 465, 83, 55,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(livingroom1,"wifi6"), 88, 465, 83, 55,"wifi6",ctx);
        this.drawSquare1(this.checkSignal(livingroom1,"wifi5"), 171, 465, 83, 55,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(livingroom1,"wifi1"), 253, 465, 83, 55,"wifi1",ctx);
    
        this.drawSquare1(this.checkSignal(livingroom1,"wifi4"), 5, 520, 83, 55,"wifi4",ctx);
        this.drawSquare1(this.checkSignal(livingroom3,"wifi5"), 88, 520, 83, 55,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(livingroom1,"wifi3"), 171, 520, 83, 55,"wifi3",ctx);
        this.drawSquare1(this.checkSignal(livingroom1,"wifi2"), 253, 520, 83, 55,"wifi2",ctx);
    
        this.drawSquare1(this.checkSignal(livingroom3,"wifi6"), 5, 575, 83, 55,"wifi6",ctx);
        this.drawSquare1(this.checkSignal(livingroom3,"wifi4"), 88, 575, 83, 55,"wifi4",ctx);
        this.drawSquare1(this.checkSignal(livingroom3,"wifi3"), 171, 575, 83, 55,"wifi3",ctx);
        //this.drawSquare(0.80,253, 575, 83, 55,ctx);
    
        this.drawSquare1(this.checkSignal(livingroom3,"wifi7"), 5, 620, 83, 55,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(livingroom3,"wifi2"), 88, 620, 83, 55,"wifi2",ctx);
        this.drawSquare1(this.checkSignal(livingroom3,"wifi1"), 171, 620, 83, 55,"wifi1",ctx);
        //this.drawSquare(0.65,253, 620, 83, 55,ctx);
    
        this.drawSquare1(this.checkSignal(livingroom2,"wifi1"), 5, 675, 83, 55,"wifi1",ctx);
        this.drawSquare1(this.checkSignal(livingroom2,"wifi2"), 88, 675, 83, 55,"wifi2",ctx);
        this.drawSquare1(this.checkSignal(livingroom2,"wifi3"), 171, 675, 83, 55,"wifi3",ctx);
        //this.drawSquare(0.77,253, 675, 83, 55,ctx);
    
        this.drawSquare1(this.checkSignal(livingroom2,"wifi4"), 5, 725, 83, 55,"wifi4",ctx);
        this.drawSquare1(this.checkSignal(livingroom2,"wifi5"), 88, 725, 83, 55,"wifi5",ctx);
        this.drawSquare1(this.checkSignal(livingroom2,"wifi7"), 171, 725, 83, 55,"wifi7",ctx);
        this.drawSquare1(this.checkSignal(livingroom2,"wifi6"), 253, 725, 83, 55,"wifi6",ctx);
      }
    
      private drawSquare(quality:any,x: number, y: number, w: number, h: number) {
       
        this.ctx.fillStyle = this.rgb(quality);
        this.ctx.fillRect(x, y, w, h);
        this.ctx.globalAlpha = 10
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(quality, x+25, y+35);
      }
    
      private drawSquare1(quality:any,x: number, y: number, w: number, h: number,wifi:String,ctx:CanvasRenderingContext2D) {
     
        ctx.fillStyle = this.rgb(quality);
        ctx.fillRect(x, y, w, h);
        ctx.font = '20px serif';
        ctx.fillStyle = 'black';
        if(quality!=null && quality<-80){
          ctx.fillStyle = 'white';
        }
        var text=wifi+":"+quality
        ctx.fillText(text, x, y+35);


      }

      private roundedRect(ctx:CanvasRenderingContext2D,quality,wifi, x, y, width, height, radius) {
        console.log()
        ctx.fillStyle = this.rgb(quality);
        // ctx.globalAlpha=1
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);  
        ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
         ctx.fill();
        var text=quality?" "+quality*-1 :"null"
        
        
 ctx.font=" 15px Andale Mono, monospace";
 ctx.fillStyle="white";
 ctx.fillText(text, x+4, y+25);

        
      }
    
      private drawSquareForEmpty(quality:any,x: number, y: number, w: number, h: number) {
       
        this.ctx.fillStyle = this.rgb(quality);
        this.ctx.fillRect(x, y, w, h);
      }
    
      private drawSmallSquare(quality:any,x: number, y: number, w: number, h: number,wifi:String) {
       
        this.ctx.fillStyle = this.rgb(quality);
        this.ctx.fillRect(x, y, w, h);
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = 'black';
        if(quality!=null && quality<-80){
          this.ctx.fillStyle = 'white';
        }
        var text=wifi+":"+quality
        this.ctx.fillText(text, x, y+20);
      }
    
      private drawLastSquare(quality:any,x: number, y: number, w: number, h: number,wifi:String) {
       
        this.ctx.fillStyle = this.rgb(quality);
        this.ctx.fillRect(x, y, w, h);
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = 'black';
        if(quality!=null && quality<-80){
          this.ctx.fillStyle = 'white';
        }
        var text=wifi+":"+quality
        this.ctx.fillText(text, x+30, y+28);
      }
    
      private drawBar(x: number, y: number, w: number, h: number,ctx: CanvasRenderingContext2D) {
       
        ctx.lineWidth =2
        ctx.strokeRect(x, y, w, h);
        ctx.font = '20px serif';
        ctx.fillStyle = 'black';
        ctx.fillText("", x, y+35);
      }
    
      private drawSquareForBar(rgb:string,x: number, y: number, w: number, h: number, index: number,ctx: CanvasRenderingContext2D) {
       
        ctx.fillStyle = rgb
        ctx.fillRect(x, y, w, h);
        if(this.legendNumbers.get(index))
        {    ctx.font = '16px serif';
        ctx.fillStyle = 'black';
        ctx.fillText(this.legendNumbers.get(index), x+15, y);}
    
      }
    
      private drawRoomName( x: number, y: number, w: number, h: number, roomName: string) {
    
        this.ctx.font = '26px serif';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(roomName, x, y);
      }
    
      
      // private drawRoomNameRotated( x: number, y: number, w: number, h: number, roomName: string) {
        
      //   this.ctx2.font = '26px serif';
      //   this.ctx2.fillStyle = 'black';
      //   this.ctx2.fillText(roomName, x, y);
      
      // }
    
    
      public rgb(value:any):string{
        var val ='rgba(160,160,160)';
        if(value!=null){
        var color=this.colors.length+value*2.5
        val=""+this.colors[Math.round(color)]
  
      }
    
      
    return val;
      }
    
    
    
    
      async getApiResponseThroughput() {
        return  await this.httpClient.get(ApiList.FLOOR_PLAN_DATA)
          .toPromise().then((res:Results) => {
    // this.aggregatedSum
    // const temp_row = [
    //   new Date(row.timestamp).getTime(),
    //   row.value
    // ];
    // console.log(res[0]._id.time + " "+res[0].total )
    return res;
          }).catch((err: HttpErrorResponse) => {
            // simple logging, but you can do a lot more, see below
            this.ngOnDestroy()
            console.log('An error occurred in Http Request'+err.message);
            throw err.error 
          });
      }

      public HotIronBluePalette()
      {
        var parts = this.init.split("\r\n");
        
        for (let index = 0; index < parts.length; index++) {
          var rgb =parts[index].split("	");
          this.colors[index]="rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.8)"
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

    ngOnDestroy() {
      // For method 1
      this.subscription && this.subscription.unsubscribe();
    }

    showDetails(event: MouseEvent, outerDiv: HTMLElement){
      var bounds = outerDiv.getBoundingClientRect();
      var posX = event.clientX - bounds.left;
      var posY = event.clientY - bounds.top;

      
      console.log(posX,posY)
      for (var i = 0; i < this.data.values.length; i++) {
      var dot = this.data.values[i];
      if (posX>dot.x && posX<dot.x+41 && posY > dot.y &&posY<dot.y+41) {
        this.tipCtx.clearRect(0, 0, this.tipCanvas.nativeElement.width, this.tipCanvas.nativeElement.height);
          this.tipCtx=this.tipCanvas.nativeElement.getContext("2d");
          this.tipCanvas.nativeElement.style.visibility ="visible"
          console.log( "Sonuclar",posX,posY)
          this.tipCanvas.nativeElement.style.left = (posX) + "px";
          this.tipCanvas.nativeElement.style.top = (posY -100) + "px";
          var key=dot.ip+dot.wlan
          var iwdevInfo:IwdevInfo= this.tooltipDetails.get(key)
          if(iwdevInfo){
            var bitrate=iwdevInfo.getBitrate()+"MBit/s"
            var frequency = iwdevInfo.getFrequency()
            var ssid = iwdevInfo.getSSID()
            var channel = iwdevInfo.getChannel()
          
            }
            this.makeBold(this.tipCtx,"Wlan: ",dot.wlan,5,15);
            this.makeBold(this.tipCtx,"Ip: ",dot.ip,5,35);
            if(iwdevInfo){
              
              this.makeBold(this.tipCtx,"Channel: ",channel,5,55);
              this.makeBold(this.tipCtx,"Bitrate: ",bitrate,5,75);
              this.makeBold(this.tipCtx,"Frequency: ",frequency,5,95);
              this.makeBold(this.tipCtx,"SSID: ",ssid,5,115);
            }          else{
              this.makeBold(this.tipCtx,"Channel: ","N/A",5,55);
              this.makeBold(this.tipCtx,"Bitrate: ","N/A",5,75);
              this.makeBold(this.tipCtx,"Frequency: ","N/A",5,95);
              this.makeBold(this.tipCtx,"SSID: ","N/A",5,115);
            }
          break;
        }
        else{
          this.tipCtx=this.tipCanvas.nativeElement.getContext("2d");
          this.tipCanvas.nativeElement.style.visibility ="hidden"
          this.tipCtx.clearRect(0, 0, this.tipCanvas.nativeElement.width, this.tipCanvas.nativeElement.height);
        }
       

  }
    }


    showDetailsForKitchen(event: MouseEvent, outerDiv: HTMLElement){
      var bounds = outerDiv.getBoundingClientRect();
      var posX = event.clientX - bounds.left;
      var posY = event.clientY - bounds.top;

      
      console.log(posX,posY)
      for (var i = 0; i < this.dataForKitchen.values.length; i++) {
      var dot = this.dataForKitchen.values[i];
      if (posX>dot.x && posX<dot.x+41 && posY > dot.y &&posY<dot.y+41) {
          this.tipCtxKitchen.clearRect(0, 0, this.tipKitchenCanvas.nativeElement.width, this.tipKitchenCanvas.nativeElement.height);
          this.tipCtxKitchen=this.tipKitchenCanvas.nativeElement.getContext("2d");
          this.tipKitchenCanvas.nativeElement.style.visibility ="visible"
          console.log( "Sonuclar",posX,posY)
          this.tipKitchenCanvas.nativeElement.style.left = (posX) + "px";
          this.tipKitchenCanvas.nativeElement.style.top = (posY - 100) + "px";
          var key=dot.ip+dot.wlan
          var iwdevInfo:IwdevInfo= this.tooltipDetails.get(key)
          if(iwdevInfo){
          var bitrate=iwdevInfo.getBitrate()+"MBit/s"
          var frequency = iwdevInfo.getFrequency()
          var ssid = iwdevInfo.getSSID()
          var channel = iwdevInfo.getChannel()
          }
          this.makeBold(this.tipCtxKitchen,"Wlan: ",dot.wlan,5,15);
          this.makeBold(this.tipCtxKitchen,"Ip: ",dot.ip,5,35);
          if(iwdevInfo){
            
            this.makeBold(this.tipCtxKitchen,"Channel: ",channel,5,55);
            this.makeBold(this.tipCtxKitchen,"Bitrate: ",bitrate,5,75);
            this.makeBold(this.tipCtxKitchen,"Frequency: ",frequency,5,95);
            this.makeBold(this.tipCtxKitchen,"SSID: ",ssid,5,115);
          }
          else{
            this.makeBold(this.tipCtxKitchen,"Channel: ","N/A",5,55);
            this.makeBold(this.tipCtxKitchen,"Bitrate: ","N/A",5,75);
            this.makeBold(this.tipCtxKitchen,"Frequency: ","N/A",5,95);
            this.makeBold(this.tipCtxKitchen,"SSID: ","N/A",5,115);
          }
          break;
        }
        else{
          this.tipCtxKitchen=this.tipKitchenCanvas.nativeElement.getContext("2d");
          this.tipKitchenCanvas.nativeElement.style.visibility ="hidden"
          this.tipCtxKitchen.clearRect(0, 0, this.tipKitchenCanvas.nativeElement.width, this.tipKitchenCanvas.nativeElement.height);
        }
       

  }
    }

    showDetailsForUpstairs(event: MouseEvent, outerDiv: HTMLElement){
      var bounds = outerDiv.getBoundingClientRect();
      var posX = event.clientX - bounds.left;
      var posY = event.clientY - bounds.top;

      
      console.log(posX,posY)
      for (var i = 0; i < this.dataForUpstairs.values.length; i++) {
      var dot = this.dataForUpstairs.values[i];
      if (posX>dot.x && posX<dot.x+41 && posY > dot.y &&posY<dot.y+41) {
        this.tipCtxUpstairs.clearRect(0, 0, this.tipUpstairsCanvas.nativeElement.width, this.tipUpstairsCanvas.nativeElement.height);
          this.tipCtxUpstairs=this.tipUpstairsCanvas.nativeElement.getContext("2d");
          this.tipUpstairsCanvas.nativeElement.style.visibility ="visible"
          var key=dot.ip+dot.wlan
          var iwdevInfo:IwdevInfo= this.tooltipDetails.get(key)
          if(iwdevInfo){
            var bitrate=iwdevInfo.getBitrate()+"MBit/s"
          
            var frequency = iwdevInfo.getFrequency()
            var ssid = iwdevInfo.getSSID()
            var channel = iwdevInfo.getChannel()
            console.log("Channel is "+channel)
            }
          console.log(bitrate,frequency,channel,ssid)
          this.tipUpstairsCanvas.nativeElement.style.left = (posX) + "px";
          this.tipUpstairsCanvas.nativeElement.style.top = (posY - 100) + "px";
 
          this.makeBold(this.tipCtxUpstairs,"Wlan: ",dot.wlan,5,15);
          this.makeBold(this.tipCtxUpstairs,"Ip: ",dot.ip,5,35);
          if(iwdevInfo){
            
            this.makeBold(this.tipCtxUpstairs,"Channel: ",channel,5,55);
            this.makeBold(this.tipCtxUpstairs,"Bitrate: ",bitrate,5,75);
            this.makeBold(this.tipCtxUpstairs,"Frequency: ",frequency,5,95);
            this.makeBold(this.tipCtxUpstairs,"SSID: ",ssid,5,115);
          }          else{
            this.makeBold(this.tipCtxUpstairs,"Channel: ","N/A",5,55);
            this.makeBold(this.tipCtxUpstairs,"Bitrate: ","N/A",5,75);
            this.makeBold(this.tipCtxUpstairs,"Frequency: ","N/A",5,95);
            this.makeBold(this.tipCtxUpstairs,"SSID: ","N/A",5,115);
          }
          break;
        }
        else{
          this.tipCtxUpstairs=this.tipUpstairsCanvas.nativeElement.getContext("2d");
          this.tipUpstairsCanvas.nativeElement.style.visibility ="hidden"
          this.tipCtxUpstairs.clearRect(0, 0, this.tipUpstairsCanvas.nativeElement.width, this.tipUpstairsCanvas.nativeElement.height);
        }
       

  }
    }

    private makeBold(ctx,word,word2,h,w){
      ctx.font = "bold 15px Andale Mono, monospace";
      ctx.fillText(word, h,w);
      var textWidth = ctx.measureText(word).width;
      ctx.font = "15px Andale Mono, monospace";
      ctx.fillText(word2, h + textWidth, w);

    }

    
    async getApiResponseForChannel() {
      return  await this.httpClient.get(ApiList.CHANNEL_LIST)
        .toPromise().then((res:HeatmapResults) => {
  return res;
        }).catch((err: HttpErrorResponse) => {
          // simple logging, but you can do a lot more, see below
          console.log('An error occurred in Http Request'+err.message);
          throw err.error 
        });
    }
    
    private async channelInformation() {
      var response = await this.getApiResponseForChannel()
      response.results[0].series.forEach(row => {
        row.values.forEach(element => {
  this.channelMap.set(element[1],element[2])
        })
      })
    }
    public isEmpty(obj) {
      return Object.keys(obj).length === 0;
  }

 
}
