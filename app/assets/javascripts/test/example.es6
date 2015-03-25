"use strict";
class Example {
  constructor(foo, bar) {
    this.foo = foo;
    this.bar = bar;
    console.log("example class instantiated");
  }

  concat() {
    let i = 0;
    console.log(i);
    return this.foo + this.bar;
  }
}

export { Example };
