"use strict";

import {Tool} from './tool';

export class Rectangle extends Tool {
  onPenMove(state, loc) {
    let orig = loc.original,
        curr = loc.current,
        ctx = this.prepare(state);
    this.clearContext(ctx, orig, loc.previous);
    ctx.rect(orig.x, orig.y, curr.x - orig.x, curr.y - orig.y);
    ctx.stroke();
  }
}
