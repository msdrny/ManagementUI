import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessagesHelper } from 'src/app/helpers/messages';

@Component({
  selector: 'app-commentbox',
  templateUrl: './commentbox.component.html',
  styleUrls: ['./commentbox.component.css']
})
export class CommentboxComponent implements OnInit {

  commentForm: FormGroup;
  commentInfo: Array<object> = [];
  submitted: Boolean = false;
  public id = 0;
  @Output() usercomment = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private httpClient:HttpClient,private messageheHelper:MessagesHelper) { }

  ngOnInit() {
    this.createForm();
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
      this.commentInfo.push({
        commentId : this.id++,
        currentDate : new Date(),
        commentTxt: this.commentForm.controls['comment'].value,
        //replyComment: []
      });
      var data ={"comment":this.commentForm.controls['comment'].value,"insertDate": (new Date()).toLocaleDateString(),"date": new Date()}
      this. getApiResponseForTestMetadata(data)
      this.usercomment.emit(this.commentInfo);
    }
  }

   getApiResponseForTestMetadata(commentInfo) {
    var url =localStorage.getItem('host')+":4000/api/getTestMetaData"
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
    this.httpClient.post(localStorage.getItem('host')+":4000/api/addComment",commentInfo,{observe: 'response', responseType: 'text'})
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


}
