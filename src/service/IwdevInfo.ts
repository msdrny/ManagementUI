export class IwdevInfo {




  private bitrate:number
  private frequency:number
  private ssid:String
  public channel:String



	constructor(bitrate:number,frequency:number,ssid:String,channel:String) {
    this.bitrate=bitrate
    this.frequency=frequency
    this.ssid=ssid
    this.channel=channel
	}

    public getBitrate(): number {
        return this.bitrate;
    }

    public setBitrate(bitrate: number): void {
        this.bitrate = bitrate;
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public setFrequency(frequency: number): void {
        this.frequency = frequency;
    }

    public getSSID(): String {
        return this.ssid;
    }

    public setSSID(ssid: String): void {
        this.ssid = ssid;
    }

    public getChannel(): String {
        return this.channel;
    }

    public setChannel(channel: String): void {
        this.channel = channel;
    }

}






