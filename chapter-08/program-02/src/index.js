const $ = require('jquery');

let canvas = $("#webglCanvas");
let gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    // Fetch and display OpenGL parameters.
    let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let paramNames = [
        "UNMASKED_VENDOR_WEBGL",
        "UNMASKED_RENDERER_WEBGL",
        "MAX_TEXTURE_SIZE",
        "MAX_CUBE_MAP_TEXTURE_SIZE",
        "MAX_RENDERBUFFER_SIZE",
        "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
        "MAX_TEXTURE_IMAGE_UNITS",
        "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
        "MAX_VERTEX_ATTRIBS",
        "MAX_VERTEX_UNIFORM_VECTORS",
        "MAX_FRAGMENT_UNIFORM_VECTORS",
        "MAX_VARYING_VECTORS",
        "MAX_3D_TEXTURE_SIZE",
        "MAX_COLOR_ATTACHMENTS",
        "MAX_DRAW_BUFFERS"
    ];
    let tableRows = paramNames.map(paramName => {
        let paramID = gl[paramName] || debugInfo[paramName];
        let value = gl.getParameter(paramID);
        return "<tr><td>" + paramName + "</td><td>" + String(value) + "</td></tr>"
    });
    let paramsTableHtml = "<table cellpadding='5' border='1'>" +
            "<thead><th>Name</th><th>Value</th></thead>" +
            tableRows.join("") +
            "</table>";
    $("#paramsTable").html(paramsTableHtml);

    // Fetch and list supported extensions.
    let extensions = gl.getSupportedExtensions();
    let extensionItems = extensions.map(function (extension) {
        return "<li>" + extension + "</li>"
    });
    let extensionListHtml = "<ul>" + extensionItems.join("") + "</ul>";
    $("#extensionList").html(extensionListHtml)
}

