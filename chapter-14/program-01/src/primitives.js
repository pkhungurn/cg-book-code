import { bindBuffer } from "./vertex-index-buffer.js";

export function drawElements(gl, indexBuffer, primitiveType, count, offset, type=null) {
  type = type || gl.UNSIGNED_INT;  
  bindBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexBuffer, () => {
    gl.drawElements(primitiveType, count, type, offset);
  });
}