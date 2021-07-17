import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessagesHelper } from 'src/app/helpers/messages';
import { ApiList } from 'src/app/utils/data/apiList.data';
import { ErrorMessages } from 'src/app/utils/data/errorMessages.data';


@Component({
  selector: 'app-upload-reports',
  providers:[MessagesHelper],
  templateUrl: './upload-reports.component.html',
  styleUrls: ['./upload-reports.component.scss']
})
export class UploadReportsComponent implements OnInit {
public fileName="No file chosen"
public file:File
public progress: number;
  constructor(private httpClient:HttpClient,private messageHelper:MessagesHelper) { }

  ngOnInit(): void {
  }

  public onFileSelected($event){
    this.file = $event.target.files[0];
    this.fileName=this.file.name == null ?"N/A":this.file.name
   
   
  }

  public  showSelectedTestReport(url,file){
    //var statusUrl="http://127.0.0.1:4000/api/files/TVisionTestReportJune252021.pdf"
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let formData = new FormData();
    formData.append('file', file);
    this.httpClient.post(url,  formData,{reportProgress:true})
    .subscribe(resp => { 
        
      console.log(resp)
      this.messageHelper.showSuccessMessage()
      
    },
    (error:HttpErrorResponse) => {
      this.messageHelper.showUnsuccesfulSpecificMessage(ErrorMessages.UPLOAD_FILE_ERROR)           
      console.error('error caught in component',error)
    });
}

public uploadSelectedFile(){
  var url =ApiList.UPLOAD_FILE
  this.showSelectedTestReport(url,this.file)
}

}
