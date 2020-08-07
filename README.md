# node-protoc-plugin
Front-end for protoc code generator plugins written in Node.js

This is a Node.js port of [plugin.h][]. It's intended to have the same API,
within reason.

## Usage
```js
require('protoc-plugin')(generator);
```

Where `generator` is an object with the following methods:

### generateAll(files, parameter, context)

`files` is an array of [`FileDescriptor`](descriptor.js). A `parameter` is given
as passed on the command line. `context` is a
[`GeneratorResponseContext`](plugin.js). Should return `true` on success.

### getSupportedFeatures()

Should return a bitwise OR of features from the `Features` enum in plugin.proto.
Consider extending [`CodeGenerator`](code_generator.js) for easier access.

## TODO

1. Proper documentation
2. Missing API

[plugin.h]: https://developers.google.com/protocol-buffers/docs/reference/cpp/google.protobuf.compiler.plugin
