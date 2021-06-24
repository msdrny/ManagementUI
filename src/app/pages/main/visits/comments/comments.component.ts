import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter,
  Directive, ViewContainerRef, ViewChildren, QueryList, ComponentFactoryResolver, AfterContentInit} from '@angular/core';
import { MessagesHelper } from 'src/app/helpers/messages';
import { Comments } from 'src/service/comments';
import { ChildboxComponent } from '../childbox/childbox.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[datacontainer]',
})
export class DatacontainerDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})

export class CommentsComponent implements OnInit, OnChanges{
  @Input() postComment: Array<object> = [];
  @Output() countComments = new EventEmitter();
  public loadComponent = false;
  public commentIndex = 0;
  public reply: Array<object> = [];

  // @ViewChildren decorator to grab elements from the host view
  /* The return type of ViewChildren is QueryList.
  QueryList is just a fancy name for an object that stores
  a list of items. What is special about this object is
  when the state of the application changes Angular will
  automatically update the object items for you. */
  @ViewChildren (DatacontainerDirective) entry: QueryList<DatacontainerDirective>;

  constructor(private resolver: ComponentFactoryResolver,private httpClient:HttpClient,private messageheHelper:MessagesHelper) { }

  ngOnInit() {
  }


  ngOnChanges() {
    if (this.postComment !== undefined) {
      console.log('Main array====>', this.postComment);
    }
  }

  removeComment(no) {
 
    console.log('After remove array====>', this.postComment);
    var x:any= this.postComment[no]
    x.commentTxt
    this.deleteComment({"comment":x.commentTxt,"date":x.currentDate})
    this.postComment.splice(no, 1);
    this.countComments.emit(this.postComment);
  }

  replyComment(index) {
    this.loadComponent = true;
    const myFactory = this.resolver.resolveComponentFactory(ChildboxComponent);
    if (this.entry.toArray()[index].viewContainerRef.length <= 0 ) {
      const myRef = this.entry.toArray()[index].viewContainerRef.createComponent(myFactory);
      myRef.instance['commentNo'] = index;
      myRef.changeDetectorRef.detectChanges();
      myRef.instance.userReplycomment.subscribe(
        data => {
          console.log('Piyali=>', data);
          this.receiveReplyComment(data, index);
        }
      );
      myRef.instance.deletNo.subscribe(
        no => {
          myRef.destroy();
        }
      );
    }
  }

  receiveReplyComment($event, i) {
    this.reply = $event;
    console.log($event);
    this.postComment.forEach((element) => {
      if (element['commentId'] === i) {
        element['replyComment'].push(...$event);
        console.log('Main array after reply comment=>', this.postComment);
      }
    });
    console.log(this.reply);
    this.loadComponent = false;
  }

  
  deleteComment(commentInfo) {
    var url =localStorage.getItem('host')+":4000/api/getTestMetaData"
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    this.httpClient.post(localStorage.getItem('host')+":4000/api/deleteComment",commentInfo,{observe: 'response', responseType: 'text'})
    .subscribe(resp => { 
      console.log("Event is deleted successfully")
      
      // this.demoModal.hide()
       this.messageheHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {         
      
      this.messageheHelper.showUnsuccesfulMessage()
      console.error('error caught in component',error)
    });
  }

  getAllCommentsFromDatabase(){

    this.httpClient.get(localStorage.getItem('host')+":4000/api/getAllCalendarList").subscribe( (resp:Comments[])=>
    {
      //console.log(resp[0])
      resp.forEach(element => {
        // element.start=new Date(element.start)
        // var titleOfELement= element.title
        // var title = titleOfELement.split("     ")[1]
        // title= title.substring( 0,title.lastIndexOf(" ") );
       // console.log(title)
        // var title = element.title.substring(
        //   element.title.lastIndexOf('<div class="popover-body     ">') +72, 
        //   element.title.lastIndexOf("    </div>") );
        //  // console.log(title )
        //  // console.log(element.title)
         // this.deleteList.push({date:element.start,originalTitle:element.title,title:title})
      });
    
    
      //console.log(this.deleteList)
    })
  }


}
