"use strict";
import { Example } from 'test/example';
import { TestController } from 'test/test_controller';

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

angular.module('test', [])
.controller('TestController', TestController);
