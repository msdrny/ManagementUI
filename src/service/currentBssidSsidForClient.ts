export interface Data {
  resultType:String,
  result:Result[]
}

export interface Result {
  metric:Metric,
values:any[]
}

export interface Metric {
  __name__:string,
instance:String,
job:string,
bssid:string,
device:string,
mode:string,
ssid:string
}

export interface SSIDStatus {
  status:string,
  data:Data
}



