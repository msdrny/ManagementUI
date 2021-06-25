import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter,
  Directive, ViewContainerRef, ViewChildren, QueryList, ComponentFactoryResolver, AfterContentInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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

  constructor(private resolver: ComponentFactoryResolver,private httpClient:HttpClient,private messageheHelper:MessagesHelper,private spinner: NgxSpinnerService) { }

  ngOnInit() {
   
  }


  ngOnChanges() {
    if (this.postComment !== undefined) {
      console.log('Main array====>', this.postComment);
    }
  }


  removeComment(no) {
    console.log(no)
    console.log('After remove array====>', this.postComment);
    var x:any= this.postComment[no]
    if(x){

    this.deleteComment({"comment":x.commentTxt,"date":x.currentDate})
    this.postComment.splice(no, 1);
    this.resetCommentId()
    this.postComment = [...this.postComment]
   // console.log( this.postComment)
   console.log("After Remove data ",this.postComment)
   this.countComments.emit(this.postComment);
    }
    
  }


  
  deleteComment(commentInfo) {
    var url =localStorage.getItem('host')+":4000/api/getTestMetaData"
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    this.spinner.show()
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    this.httpClient.post(localStorage.getItem('host')+":4000/api/deleteComment",commentInfo,{observe: 'response', responseType: 'text'})
    .subscribe(resp => { 
      console.log("Event is deleted successfully")
      
      // this.demoModal.hide()
       this.messageheHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {         
      this.spinner.hide()
      this.messageheHelper.showUnsuccesfulMessage()
      console.error('error caught in component',error)
    });
    this.spinner.hide()
  }

  resetCommentId(){
    var index = 0
    this.postComment.forEach(element => {
      var item:any =element
      item.commentId= index
      index =index+1
    });
  }




}
