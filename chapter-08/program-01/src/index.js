const $ = require('jquery');
var canvas = $("#webglCanvas");
var gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
}