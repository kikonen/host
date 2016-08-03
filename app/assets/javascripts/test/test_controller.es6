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

  onEventStream() {
    console.log("ok.. getting events");
    var self = this;

    $.ajax({url: '/test/stream', method: 'get'})
      .then(function(data) {
        console.log("got events");
        var eventIdx = data.indexOf('!event:'),
            delay = 1000;

        while (eventIdx >= 0) {
          console.log('-------------');

          var headerEndIdx = data.indexOf('\n', eventIdx),
              keys = data.substring(eventIdx + 8, headerEndIdx).split(','),
              event = {};

          var startIdx = headerEndIdx + 1;
          _.each(keys, function(key) {
            var prefix = '!' + key + ':\n',
                keyIdx = data.indexOf(prefix, startIdx),
                eofIdx = data.indexOf('!eof\n', keyIdx);

            if (keyIdx > 0 && eofIdx > 0) {
              event[key] = data.substring(keyIdx + prefix.length, eofIdx - 1);
              startIdx = eofIdx + 5;
            } else {
              startIdx = data.length;
            }
          });

          console.log(event);
          if (event.html) {
            self.showData(event, delay);
          }
          delay = delay * 2;

          eventIdx = data.indexOf('!event:', startIdx);
        }
      }).fail(function(err) {
        throw err;
      });
  }

  showData(event, delay) {
    setTimeout(function() {
      console.log("=====");
      console.log(event);
      $('#event_data').html(event.html);
    }, delay);
  }
}
