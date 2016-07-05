"use strict";
export class TestController {
  constructor($q) {
    "ngInject";

    this.$q = $q;
    this.name = 'foo';
    this.pollute = "not executed";
  }

  onPollute() {
    var vm = this;
    this.pollute = "pollute...";
    this.$q.when($.ajax({
      url: "test/pollute.js",
      dadataType: 'script'
    }))
      .then(
        (v) => {
          console.log(v);
          vm.pollute = v;
        },
        (err) => {
          console.error(err);
          vm.pollute = err;
        });
  }
}
