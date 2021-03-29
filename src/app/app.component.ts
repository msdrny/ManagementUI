import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <ng4-loading-spinner> </ng4-loading-spinner>`
})
export class AppComponent {
  constructor() {
  }
}
