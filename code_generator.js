class CodeGenerator {
  // Sync with plugin.proto.
  static Feature = {
    FEATURE_PROTO3_OPTIONAL: 1,
  };

  // Implement this to indicate what features this code generator supports.
  // This should be a bitwise OR of features from the Features enum in
  // plugin.proto.
  getSupportedFeatures() { return 0; }
}

module.exports = { CodeGenerator };
