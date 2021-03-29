export interface Wifi {
interfaceName:String,
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

export interface HeatmapResults {
  results:Series[]
}

