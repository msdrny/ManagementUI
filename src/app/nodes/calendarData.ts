export class CalendarData {




  private _id: number
  private title: string
  private color: Color
  private start: Date
  private draggable: boolean
  private allDay: boolean

constructor(_title: string,_color: Color,_start: Date, _draggable: boolean,_allDay: boolean) {

  this.title=_title
  this.color=_color
  this.start=_start
  this.draggable=_draggable
  this.allDay=_allDay

}

  public get id(): number {
    return this._id
  }
  public set id(value: number) {
    this._id = value
  }
  public get getTitle(): string {
    return this.title
  }
  public set setTitle(value: string) {
    this.title = value
  }
  public get getDraggable(): boolean {
    return this.draggable
  }
  public set setDraggable(value: boolean) {
    this.draggable = value
  }
  public get getAllDay(): boolean {
    return this.allDay
  }
  public set getAllDay(value: boolean) {
    this.allDay = value
  }
  public get getStart(): Date {
    return this.start
  }
  public set setStart(value: Date) {
    this.start = value
  }
  public get getColor(): Color {
    return this.color
  }
  public set setColor(value: Color) {
    this.color = value
  }


 

}


export interface Color {
  primary: String,
  secondary: String
}