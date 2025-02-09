export function bindBuffer(gl, target, buffer, code) {
  gl.bindBuffer(target, buffer);
  code();
  gl.bindBuffer(target, null);
}

export function createVertexBuffer(gl, vertexData) {
    let vertexBuffer = gl.createBuffer();
    bindBuffer(gl, gl.ARRAY_BUFFER, vertexBuffer, () => {
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    });
    return vertexBuffer;
}

export function createIndexBuffer(gl, indexData) {        
    let indexBuffer = gl.createBuffer();
    bindBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexBuffer, () => {      
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
    });    
    return indexBuffer;
}