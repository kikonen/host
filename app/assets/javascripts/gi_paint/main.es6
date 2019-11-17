import * as app from './app';
import * as paint from './paint';

export function init() {
  app.init();
  paint.init();
  gi.initNg('paint');
}
