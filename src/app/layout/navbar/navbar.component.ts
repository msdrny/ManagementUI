import { Component, Output, EventEmitter, Renderer2, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import {LoginService} from '../../pages/login/login.service';

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  @Output() changeSidebarPosition = new EventEmitter();
  @Output() changeSidebarDisplay = new EventEmitter();
  @Output() openSidebar = new EventEmitter();

  display: string = 'Left';
  radioModel: string = 'Left';
  searchFormState: boolean = true;
  settings: any = {
    isOpen: false
  };

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private loginService: LoginService
  ) {}

  sidebarPosition(position): void {
    this.changeSidebarPosition.emit(position);
  }

  sidebarDisplay(position): void {
    this.changeSidebarDisplay.emit(position);
  }

  sidebarOpen(): void {
    this.openSidebar.emit();
  }

  searchFormOpen(): void {
    if (this.searchFormState) {
      this.changeStyleElement('#search-form', 'height', '40px');
      this.changeStyleElement('.notifications ', 'top', '86px');
    } else {
      this.changeStyleElement('#search-form', 'height', '0px');
      this.changeStyleElement('.notifications ', 'top', '46px');
    }
    this.searchFormState = !this.searchFormState;
  }

  private changeStyleElement(selector: string, styleName: string, styleValue: string): void {
    this.renderer.setStyle(this.el.nativeElement
      .querySelector(selector), styleName, styleValue);
  }

  logout() {
    this.loginService.logoutUser();
  }
}
