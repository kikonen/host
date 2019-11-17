"use strict";

import {Tool} from './tool';

export class Pen extends Tool {
  onPenMove(state, loc) {
    let prev = loc.previous,
        curr = loc.current;
    if (prev.x) {
      let ctx = this.prepare(state);
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }
  }
}
