export interface Wifi {
wifi:String
}



export interface SeriesData {
  columns:String[],
  name:String,
  tags:Wifi,
  values:any[]
}

export interface Series {
  series:SeriesData[]
}

export interface Results {
  results:Series[]
}

