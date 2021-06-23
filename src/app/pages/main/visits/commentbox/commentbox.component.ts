import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder,private httpClient:HttpClient) { }

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
        replyComment: []
      });
      this.usercomment.emit(this.commentInfo);
    }
  }

  //  getApiResponseForTestMetadata() {
  //   var url =localStorage.getItem('host')+":4000/api/getTestMetaData"
  //   let headers = new HttpHeaders();
  //   headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
  //   // this.httpClient.post(localStorage.getItem('host')+":4000/api/mesud",calendarData,  {observe: 'response'})
  //   this.httpClient.post(localStorage.getItem('host')+":4000/api/addComment",calendarData,)
  //   .subscribe(resp => { 
  //     console.log("Event is added successfully")
  //     this.insertLoadInfoToDatabase()
  //      this.demoModal.hide()
  //      this.messageheHelper.showSuccessMessage()
  //   },
  //   (error:HttpErrorResponse) => {         
      
  //     this.messageheHelper.showUnsuccesfulMessage()
  //     console.error('error caught in component',error)
  //   });
  // }


}
