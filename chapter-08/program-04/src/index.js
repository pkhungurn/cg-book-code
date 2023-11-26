const $ = require('jquery');
require("jquery-ui/ui/widgets/slider");
require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/themes/base/theme.css');

var sliderNames = ["rSlider", "gSlider", "bSlider"];
sliderNames.forEach(function (name) {
    $("#" + name).slider({
        min: 0,
        max: 255,
        value: 0
    });
});

var canvas = $("#webglCanvas");
var gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    function updateWebGL() {
        var rgb = sliderNames.map(function (name) {
            return $("#" + name).slider("value") / 255.0;
        });
    
        gl.clearColor(rgb[0], rgb[1], rgb[2], 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        window.requestAnimationFrame(updateWebGL);
    }
    
    window.requestAnimationFrame(updateWebGL);
}