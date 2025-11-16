import { bindBuffer, createIndexBuffer, createVertexBuffer } from "./vertex-index-buffer.js";


export class PosColMesh {
  constructor(gl, vertexData, indexData) {
    this.gl = gl;
    this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));
    this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    this.numVertices = Math.floor(vertexData / 5);
  }

  setupVertexAttributes(program, vertPositionName="vert_position", vertColorName="vert_color") {
    program.attribute(vertPositionName)?.setup(this.vertexBuffer, 2, 4*5, 0);            
    program.attribute(vertColorName)?.setup(this.vertexBuffer, 3, 4*5, 4*2);
  }

  drawElements(mode=null, count=null, offset=0) {
    if (mode === null) {
      mode = this.gl.TRIANGLES;
    }
    if (count === null) {
      count = this.numVertices * 5;      
    }    
    drawElements(this.gl, this.indexBuffer, mode, count, offset);
  }

  draw(program, vertPositionName="vert_position", vertColorName="vert_color") {
    this.setupVertexAttributes(program, vertPositionName, vertColorName);
    this.drawElements();
  }
}