import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { TestReport } from 'src/service/testReports';
import { saveAs } from 'file-saver';
import { MessagesHelper } from 'src/app/helpers/messages';
import { ErrorMessages } from 'src/app/utils/data/errorMessages.data';
@Component({
  selector: 'app-download-reports',
  providers:[MessagesHelper],
  templateUrl: './download-reports.component.html',
  styleUrls: ['./download-reports.component.scss']
})
export class DownloadReportsComponent implements OnInit {
public doc
public testReports =  []
  constructor(private httpClient:HttpClient,private messageHelper:MessagesHelper) {pdfDefaultOptions.assetsFolder = 'bleeding-edge'; }

   ngOnInit() {
    //this.getCurrentStatusForDevice()
    this.getAllTestReports()
  }




  public  getAllTestReports(){
    var statusUrl="http://127.0.0.1:4000/api/files"
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    this.httpClient.get<TestReport[]>(statusUrl,  )
    .subscribe(resp => { 
      console.log(resp)
      this.testReports=resp
    },
    (error:HttpErrorResponse) => {    
      this.messageHelper.showUnsuccesfulSpecificMessage(ErrorMessages.SHOW_LIST_ERROR)     
      console.error('error caught in component',error)
    });
}
  public  showSelectedTestReport(url){
      //var statusUrl="http://127.0.0.1:4000/api/files/TVisionTestReportJune252021.pdf"
      let headers = new HttpHeaders();
      headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
      this.httpClient.get(url,  {observe: 'response', responseType: 'blob'})
      .subscribe(resp => { 
        let file = new Blob([resp.body], { type: 'application/pdf' });   
        console.log(file)         
        this.doc =file
        console.log(this.doc)       
        
      },
      (error:HttpErrorResponse) => {
        this.messageHelper.showUnsuccesfulSpecificMessage(ErrorMessages.SHOW_FILE_ERROR)           
        console.error('error caught in component',error)
      });
  }





  public showTestReport(url){
    console.log(url)
  this.showSelectedTestReport(url)
  }

  public downloadTestReport(url){
    console.log(url)
    this.httpClient.get(url, {responseType: 'blob'})
    .subscribe(resp => {
        var blob = new Blob([resp]);
        var path = url.split("/")
        console.log(path)
        saveAs(blob,path[path.length-1]);
        this.messageHelper.showSuccessMessage()
    },
    (error:HttpErrorResponse) => {       
      this.messageHelper.showUnsuccesfulSpecificMessage(ErrorMessages.DOWNLOAD_FILE_ERROR)    
      console.error('error caught in component',error)
    });
  }


}
