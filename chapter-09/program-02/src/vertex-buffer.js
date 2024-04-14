function createVertexBuffer(gl, vertexData) {
  // Step 1: Create a buffer object.
  let vertexBuffer = gl.createBuffer();

  // Step 2: Bind the buffer to the ARRAY_BUFFER target.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Step 3: Transfer the vertex data to GPU.
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  // Step 4: Unbind the buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Step 5: Return the vertex buffer.
  return vertexBuffer;
}

exports.createVertexBuffer = createVertexBuffer;