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
job:string
}

export interface CurrentStatus {
  status:string,
  data:Data
}


