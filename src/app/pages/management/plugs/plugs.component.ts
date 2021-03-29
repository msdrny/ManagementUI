import { Component, OnInit } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-plugs',
  templateUrl: './plugs.component.html',
  styleUrls: ['./plugs.component.scss']
})
export class PlugsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  stateCtrl = {
    checked: true,
    
  };
 
  onChange(value: boolean) {
    /* Your business logic goes here. */
  }

}
