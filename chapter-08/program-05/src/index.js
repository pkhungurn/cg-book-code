const $ = require('jquery');
require("jquery-ui/ui/widgets/slider");
require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/themes/base/theme.css');

var sliderNames = ["rSlider", "gSlider", "bSlider"];
var rgbSliders = sliderNames.map(name => $("#" + name).slider({
    min: 0,
    max: 255,
    value: 0
}));
rgbSliders[0].slider("value", 255);

var canvas = $("#webglCanvas");
var gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    function updateWebGL() {        
        var rgb = rgbSliders.map((rgbSlider) => rgbSlider.slider("value") / 255.0);
        
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(128,128,256,256);
    
        gl.clearColor(rgb[0], rgb[1], rgb[2], 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
 
        window.requestAnimationFrame(updateWebGL);
    }
    
    window.requestAnimationFrame(updateWebGL);
}