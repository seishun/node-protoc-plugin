const fs = require('fs');
const { CodeGeneratorRequest, CodeGeneratorResponse } = require('google-protobuf/google/protobuf/compiler/plugin_pb');
const { DescriptorPool } = require('./descriptor');

module.exports = function(generator) {
  const request = CodeGeneratorRequest.deserializeBinary(fs.readFileSync(0));
  const response = new CodeGeneratorResponse();
  generateCode(request, generator, response);
  fs.writeFileSync(1, response.serializeBinary());
};

function generateCode(request, generator, response) {
  const pool = new DescriptorPool();
  for (const protoFile of request.getProtoFileList()) {
    pool.buildFile(protoFile);
  }

  const parsedFiles = [];
  for (const fileToGenerate of request.getFileToGenerateList()) {
    parsedFiles.push(pool.findFileByName(fileToGenerate));
  }

  const context = new GeneratorResponseContext(response);

  generator.generateAll(parsedFiles, request.getParameter(), context);

  response.setSupportedFeatures(generator.getSupportedFeatures());
}

class GeneratorResponseContext {
  constructor(response) {
    this.response_ = response;
  }

  open(filename) {
    const file = this.response_.addFile();
    file.setName(filename);
    return file;
  }

  write(file, data) {
    file.setContent(file.getContent() + data);
  }
}
