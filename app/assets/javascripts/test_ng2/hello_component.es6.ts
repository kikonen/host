import {Component} from '@angular/core';

@Component({
  selector: 'hello-app',
  templateUrl: '/test_ng2/hello_component.html'
  template: 'xxxxx'
})
export class HomeComponent {
  message: string;

  constructor() {
    console.log("created hello");
    this.message = 'hello world';
  }
}
