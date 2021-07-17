
import UrlJson from '../../../assets/url.json'

export const ApiList={
   
    CURRENT_TEST_STATUS: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/getTestStatus",
    ALL_CALENDAR_LIST: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/getAllCalendarList",
    NEW_CALAENDAR_EVENT:UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/mesud",
    DELETE_CALAENDAR_EVENT:UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/deleteMesud",
    CURRENT_TEST_METADATA:UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/getTestMetaData",
    LIVE_WATERFALL_RSSI:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort+'/query?db=rssi&q= select Round(mean("Signal")) as Signal, mean("Frequency") as Frequency, mean("Bitrate") as Bitrate   from rssi where time>=now()-3600000000000 group by time(15s), wifi,interfaceName',
    CHANNEL_LIST:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort+"/query?db=rssi&q= select frequency,channel from channel",
    FLOOR_PLAN_DATA:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort+"/query?db=rssi&q= select interfaceName,Signal,Bitrate,Frequency,SSID from rssi where time>now()-10000000000  group by wifi",
    START_HACKRF_LOAD: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/startHackrfLoad",
    CURRENT_HACKRF_STATUS: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/getHackrfStatus",
    STOP_HACKRF_LOAD: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/stopHackrfLoad",
    CURRENT_HACKRF_LOAD:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort+"/query?db=rssi&q= select LAST(percentage),LAST(channel) from hackrfLoad",
    INSERT_LOAD_INFO_INFLUX:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort+"/write?db=rssi",
    CURRENT_SMARTPLUG_LIST: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/deviceList",
    TOGGLE_SMARTPLUG: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/toggleSmartPlug",
    UPLOAD_FILE: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/upload",
    VIEW_FILE: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/files",
    ADD_COMMENT: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/addComment",
    SHOW_ALL_COMMENT: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/getAllComments",
    DELETE_COMMENT: UrlJson.backendUrl+":"+UrlJson.backendPort+"/api/deleteComment",
    BACKEND:UrlJson.backendUrl,
    INFLUXDB:UrlJson.influxDBUrl+":"+UrlJson.influxDBPort

   
   
};









