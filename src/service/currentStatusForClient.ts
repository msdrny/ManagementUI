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
address:string,
broadcast:string,
device:string,
duplex:string,
operstate:string
}

export interface ClientStatus {
  status:string,
  data:Data
}



