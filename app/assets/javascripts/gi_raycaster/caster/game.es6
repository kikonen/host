"use strict";

import { MOBILE } from './common';
import Controls from './controls';
import Map from './map';
import Player from './player';
import Camera from './camera';
import GameLoop from './game_loop';

export function init() {
  var display = document.getElementById('display');
  var player = new Player(15.3, -1.2, Math.PI * 0.3);
  var map = new Map(32);
  var controls = new Controls();
  var camera = new Camera(display, MOBILE ? 160 : 320, 0.8);
  var loop = new GameLoop();

  map.randomize();

  loop.start(function frame(seconds) {
    map.update(seconds);
    player.update(controls.states, map, seconds);
    camera.render(player, map);
  });
}
