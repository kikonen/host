//
//= require jquery-2.1.3/jquery
//= require jquery-ujs-1.0.3/rails
//= require lodash-3.0.0/lodash
//= require bootstrap-sass-3.3.4/bootstrap-sprockets
//
//= require angular-1.3.15/angular
//
//=require_tree .
//=require_self
"use strict";

export default angular.module("shared", [])
.config(($locationProvider) => {
  $locationProvider.html5Mode(true);
});
