import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessagesHelper } from 'src/app/helpers/messages';
import { ApiList } from 'src/app/utils/data/apiList.data';
import { Comments } from 'src/service/comments';

@Component({
  selector: 'app-commentbox',
  templateUrl: './commentbox.component.html',
  styleUrls: ['./commentbox.component.css']
})
export class CommentboxComponent implements OnInit {

  commentForm: FormGroup;
  commentInfo: Array<object> = [];
  @Input() deletedComments: Array<object> = [];
  submitted: Boolean = false;
  public id = 0;
  @Output() usercomment = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private httpClient:HttpClient,private messageheHelper:MessagesHelper) { }

  ngOnInit() {
    this.createForm();
    console.log("mesud erenay")
    this.getAllCommentsFromDatabase()
  }

  ngOnChanges() {
    if (this.deletedComments !== undefined) {
      console.log('Oppppss Something deleted', this.deletedComments);
    }
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return false;
    } else {
     

      this.commentInfo.forEach(element => {
        var x:any= element
        x.commentId++
      });
      this.commentInfo.unshift({
        commentId : 0,
        currentDate : new Date(),
        commentTxt: this.commentForm.controls['comment'].value,
        //replyComment: []
      });
      var data ={"comment":this.commentForm.controls['comment'].value,"insertDate": (new Date()).toLocaleDateString(),"date": new Date()}
      this. addNewRow(data)
      this.commentInfo = [... this.commentInfo]
      this.usercomment.emit(this.commentInfo);
    }
  }

  addNewRow(commentInfo) {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    this.httpClient.post(ApiList.ADD_COMMENT,commentInfo,{observe: 'response', responseType: 'text'})
    .subscribe(resp => { 
      console.log("Event is added successfully")
      
      // this.demoModal.hide()
       this.messageheHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {         
      
      this.messageheHelper.showUnsuccesfulMessage()
      console.error('error caught in component',error)
    });
  }

  getAllCommentsFromDatabase(){
    this.httpClient.get(ApiList.SHOW_ALL_COMMENT).subscribe( (resp:Comments[])=>
    {
      
    
      resp.forEach(element => {
        console.log(resp)
       // this.postComment.push(null)
       this.commentInfo.push({
        commentId : this.id++,
        currentDate : element.date,
        commentTxt: element.comment,
        //replyComment: []
      });


        

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
      this.commentInfo = [... this.commentInfo]
      this.usercomment.emit(this.commentInfo)
    
      //console.log(this.deleteList)
    })
  }


}
