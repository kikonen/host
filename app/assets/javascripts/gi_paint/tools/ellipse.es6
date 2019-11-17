"use strict";

import {Tool} from './tool';

export class Ellipse extends Tool {
  onPenMove(state, loc) {
    let orig = loc.original,
        curr = loc.current,
        c = this.draw.getCanvas();

    let ctx = this.prepare(state);
    this.clearContext(ctx, orig, loc.previous);
    this.drawEllipse(ctx, orig.x, orig.y, curr.x - orig.x, curr.y - orig.y);
    ctx.stroke();
  }

  // @see http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
  drawEllipse(ctx, x, y, w, h) {
    var kappa = 0.5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
  }
}
