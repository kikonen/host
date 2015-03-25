"use strict";
import { Example } from 'test/example';

class Test {
  constructor() {
    console.log("test class instantiated");
  }

  foo() {
    return "x";
  }

}
console.log("loaded test module");

let test = new Test(),
    example = new Example(1, 2);
console.log(example.concat());
