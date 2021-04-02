import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ssh',
  templateUrl: './ssh.component.html',
  styleUrls: ['./ssh.component.scss']
})
export class SshComponent implements OnInit {
  title = 'SSH Connections';
  color = 'accent';
 public src
	public isLoaded = false;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   // this.src = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
    
  }

  public clearUrl(url) {

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  node1(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8080");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8181");
  }
  node2(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8182");
  }
  node3(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8183");
  }
  node4(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8184");
  }
  node5(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8185");
  }
  node6(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8186");
  }
  node7(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8187");
  }
  node8(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8188");
  }
  node9(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8189");
  }
  node10(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8190");
  }
  node11(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8191");
  }
  node12(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8192");
  }
  node13(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8193");
  }
  iperfServer(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8194");
  }

  mainServer(){
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8180");
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.10.105:8195");
  }


}
