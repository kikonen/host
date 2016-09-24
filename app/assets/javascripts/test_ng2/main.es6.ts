import { bootstrap }    from '@angular/platform-browser-dynamic';

///<reference path="hello_component.es6.ts" />
import { HelloComponent } from './hello_component';

export function init() {
  console.log("booting...");
  bootstrap(HelloComponent).catch(function(err) {
    console.log(err);
  });
}
