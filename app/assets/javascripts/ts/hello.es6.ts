///<reference path="bar.es6" />

import { X } from './bar';

class Hello {
  private x;

  constructor(x) {
    this.x = x;
  }

  hello() {
    console.log("hello " + this.x);
    alert("hello " + this.x);
  }
}

export function init() {
  let hello = new Hello(X);
  hello.hello();
}
