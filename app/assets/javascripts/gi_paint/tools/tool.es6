"use strict";

export const BUTTONS = {
  one: 1
};

export class Tool {
  setCanvas(canvas) {
    this.canvas = canvas;
    this.state = canvas.state;
    this.primary = canvas.primary;
    this.draw = canvas.draw;
    this.loc = this.state.location;
  }

  onPenDown(state, loc) {
  }

  onPenUp(state, loc) {
    this.saveDraw(state);
    this.clearLocation(state);
  }

  onPenMove(state, loc) {
  }

  onPenCancel(state) {
    this.clearDraw(state);
    this.clearLocation(state);
  }

  prepare(state) {
    let ctx = this.draw.getContext(),
        palette = state.palette;
    ctx.beginPath();
    ctx.strokeStyle = palette.strokeStyle;
    ctx.lineWidth = palette.lineWidth;
    return ctx;
  }

  clearLocation(state) {
    let loc = state.location,
        curr = loc.current,
        prev = loc.previous,
        orig = loc.original;
    orig.x = null;
    orig.y = null;
    prev.x = null;
    prev.y = null;
    curr.x = null;
    curr.y = null;
  }

  /**
   * Save drawing layer and clear it
   */
  saveDraw(state) {
    let draw = this.draw,
        primary = this.primary,
        c = draw.getCanvas();

    primary.getContext().drawImage(c, 0, 0);
    draw.getContext().clearRect(0, 0, c.width, c.height);
  }

  cleardraw(state) {
    let draw = this.draw,
        c = draw.getCanvas();

    draw.getContext().clearRect(0, 0, c.width, c.height);
  }

  /**
   * Clears drawing context optimally
   */
  clearContext(ctx, orig, prev) {
    let clearX = prev.x < orig.x ? prev.x : orig.x,
        clearY = prev.y < orig.y ? prev.y : orig.y;
    ctx.clearRect(
      clearX - 1,
      clearY - 1,
      Math.abs(prev.x - orig.x) + 2,
      Math.abs(prev.y - orig.y) + 2);
  }
}
