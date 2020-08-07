class Descriptor {
  getName() {
    return this.name_;
  }

  getFullName() {
    return this.fullName_;
  }

  getFile() {
    return this.file_;
  }

  getContainingType() {
    return this.containingType_;
  }

  getOptions() {
    return this.options_;
  }

  // Field stuff -----------------------------------------------------

  getFieldList() {
    return this.fields_;
  }

  findFieldByNumber(key) {
    const result = this.fieldsByNumber_.get(key);
    if (result == null || result.isExtension()) {
      return null;
    }
    return result;
  }

  getOneofDeclList() {
    return this.oneofDecls_;
  }

  // Nested type stuff -----------------------------------------------

  getNestedTypeList() {
    return this.nestedTypes_;
  }

  // Enum stuff ------------------------------------------------------

  getEnumTypeList() {
    return this.enumTypes_;
  }

  // Extensions ------------------------------------------------------

  getExtensionRangeList() {
    return this.extensionsRanges_;
  }

  getExtensionList() {
    return this.extensions_;
  }
}

class FieldDescriptor {
  static Type = {
    TYPE_DOUBLE: 1,    // double, exactly eight bytes on the wire.
    TYPE_FLOAT: 2,     // float, exactly four bytes on the wire.
    TYPE_INT64: 3,     // int64, varint on the wire.  Negative numbers
                       // take 10 bytes.  Use SINT64 if negative
                       // values are likely.
    TYPE_UINT64: 4,    // uint64, varint on the wire.
    TYPE_INT32: 5,     // int32, varint on the wire.  Negative numbers
                       // take 10 bytes.  Use SINT32 if negative
                       // values are likely.
    TYPE_FIXED64: 6,   // uint64, exactly eight bytes on the wire.
    TYPE_FIXED32: 7,   // uint32, exactly four bytes on the wire.
    TYPE_BOOL: 8,      // bool, varint on the wire.
    TYPE_STRING: 9,    // UTF-8 text.
    TYPE_GROUP: 10,    // Tag-delimited message.  Deprecated.
    TYPE_MESSAGE: 11,  // Length-delimited message.

    TYPE_BYTES: 12,     // Arbitrary byte array.
    TYPE_UINT32: 13,    // uint32, varint on the wire
    TYPE_ENUM: 14,      // Enum, varint on the wire
    TYPE_SFIXED32: 15,  // int32, exactly four bytes on the wire
    TYPE_SFIXED64: 16,  // int64, exactly eight bytes on the wire
    TYPE_SINT32: 17,    // int32, ZigZag-encoded varint on the wire
    TYPE_SINT64: 18,    // int64, ZigZag-encoded varint on the wire
  };

  static CppType = {
    CPPTYPE_INT32: 1,     // TYPE_INT32, TYPE_SINT32, TYPE_SFIXED32
    CPPTYPE_INT64: 2,     // TYPE_INT64, TYPE_SINT64, TYPE_SFIXED64
    CPPTYPE_UINT32: 3,    // TYPE_UINT32, TYPE_FIXED32
    CPPTYPE_UINT64: 4,    // TYPE_UINT64, TYPE_FIXED64
    CPPTYPE_DOUBLE: 5,    // TYPE_DOUBLE
    CPPTYPE_FLOAT: 6,     // TYPE_FLOAT
    CPPTYPE_BOOL: 7,      // TYPE_BOOL
    CPPTYPE_ENUM: 8,      // TYPE_ENUM
    CPPTYPE_STRING: 9,    // TYPE_STRING, TYPE_BYTES
    CPPTYPE_MESSAGE: 10,  // TYPE_MESSAGE, TYPE_GROUP
  };

  static Label = {
    LABEL_OPTIONAL: 1,  // optional
    LABEL_REQUIRED: 2,  // required
    LABEL_REPEATED: 3,  // repeated
  };

  getName() {
    return this.name_;
  }

  getFullName() {
    return this.fullName_;
  }

  getFile() {
    return this.file_;
  }

  isExtension() {
    return this.isExtension_;
  }

  getNumber() {
    return this.number_;
  }

  getType() {
    return this.type_;
  }

  getTypeName() {
    return FieldDescriptor.TYPE_TO_NAME[this.getType()];
  }

  getCppType() {
    return FieldDescriptor.TYPE_TO_CPP_TYPE_MAP[this.getType()];
  }

  getLabel() {
    return this.label_;
  }

  isRequired() {
    return this.getLabel() == FieldDescriptor.Label.LABEL_REQUIRED;
  }

  isOptional() {
    return this.getLabel() == FieldDescriptor.Label.LABEL_OPTIONAL;
  }

  isRepeated() {
    return this.getLabel() == FieldDescriptor.Label.LABEL_REPEATED;
  }

  isPackable() {
    return this.isRepeated() && FieldDescriptor.isTypePackable(this.getType());
  }

  isPacked() {
    if (!this.isPackable()) return false;
    if (this.file_.getSyntax() == FileDescriptor.Syntax.SYNTAX_PROTO2) {
      return (this.options_ != null) && this.options_.getPacked();
    } else {
      return this.options_ == null || !this.options_.hasPacked() || this.options_.getPacked();
    }
  }

  isMap() {
    return this.getType() == FieldDescriptor.Type.TYPE_MESSAGE && this.isMapMessageType();
  }

  hasPresence() {
    if (this.isRepeated()) return false;
    return this.getCppType() == FieldDescriptor.CppType.CPPTYPE_MESSAGE || this.getContainingOneof() ||
           this.getFile().getSyntax() == FileDescriptor.Syntax.SYNTAX_PROTO2;
  }

  hasDefaultValue() {
    return this.hasDefaultValue_;
  }

  getDefaultValue() {
    return this.defaultValue_;
  }

  getContainingType() {
    return this.containingType_;
  }
  
  getContainingOneof() {
    return this.containingOneof_;
  }

  getExtensionScope() {
    return this.extensionScope_;
  }

  getMessageType() {
    return this.messageType_;
  }

  getEnumType() {
    return this.enumType_;
  }

  getOptions() {
    return this.options_;
  }

  static isTypePackable(fieldType) {
    return (fieldType != FieldDescriptor.Type.TYPE_STRING &&
            fieldType != FieldDescriptor.Type.TYPE_GROUP &&
            fieldType != FieldDescriptor.Type.TYPE_MESSAGE &&
            fieldType != FieldDescriptor.Type.TYPE_BYTES);
  }

  isMapMessageType() {
    return this.messageType_.getOptions() && this.messageType_.getOptions().getMapEntry();
  }

  static TYPE_TO_CPP_TYPE_MAP = [
    0,  // 0 is reserved for errors

    FieldDescriptor.CppType.CPPTYPE_DOUBLE,   // TYPE_DOUBLE
    FieldDescriptor.CppType.CPPTYPE_FLOAT,    // TYPE_FLOAT
    FieldDescriptor.CppType.CPPTYPE_INT64,    // TYPE_INT64
    FieldDescriptor.CppType.CPPTYPE_UINT64,   // TYPE_UINT64
    FieldDescriptor.CppType.CPPTYPE_INT32,    // TYPE_INT32
    FieldDescriptor.CppType.CPPTYPE_UINT64,   // TYPE_FIXED64
    FieldDescriptor.CppType.CPPTYPE_UINT32,   // TYPE_FIXED32
    FieldDescriptor.CppType.CPPTYPE_BOOL,     // TYPE_BOOL
    FieldDescriptor.CppType.CPPTYPE_STRING,   // TYPE_STRING
    FieldDescriptor.CppType.CPPTYPE_MESSAGE,  // TYPE_GROUP
    FieldDescriptor.CppType.CPPTYPE_MESSAGE,  // TYPE_MESSAGE
    FieldDescriptor.CppType.CPPTYPE_STRING,   // TYPE_BYTES
    FieldDescriptor.CppType.CPPTYPE_UINT32,   // TYPE_UINT32
    FieldDescriptor.CppType.CPPTYPE_ENUM,     // TYPE_ENUM
    FieldDescriptor.CppType.CPPTYPE_INT32,    // TYPE_SFIXED32
    FieldDescriptor.CppType.CPPTYPE_INT64,    // TYPE_SFIXED64
    FieldDescriptor.CppType.CPPTYPE_INT32,    // TYPE_SINT32
    FieldDescriptor.CppType.CPPTYPE_INT64,    // TYPE_SINT64
  ];

  static TYPE_TO_NAME = [
    "ERROR",  // 0 is reserved for errors

    "double",    // TYPE_DOUBLE
    "float",     // TYPE_FLOAT
    "int64",     // TYPE_INT64
    "uint64",    // TYPE_UINT64
    "int32",     // TYPE_INT32
    "fixed64",   // TYPE_FIXED64
    "fixed32",   // TYPE_FIXED32
    "bool",      // TYPE_BOOL
    "string",    // TYPE_STRING
    "group",     // TYPE_GROUP
    "message",   // TYPE_MESSAGE
    "bytes",     // TYPE_BYTES
    "uint32",    // TYPE_UINT32
    "enum",      // TYPE_ENUM
    "sfixed32",  // TYPE_SFIXED32
    "sfixed64",  // TYPE_SFIXED64
    "sint32",    // TYPE_SINT32
    "sint64",    // TYPE_SINT64
  ];
}

class OneofDescriptor {
  getName() {
    return this.name_;
  }

  isSynthetic() {
    const [field, ...rest] = this.getFieldList();
    return !rest.length && field.proto3Optional_;
  }

  getContainingType() {
    return this.containingType_;
  }

  getFieldList() {
    return this.fields_;
  }
}

class EnumDescriptor {
  getName() {
    return this.name_;
  }

  getFullName() {
    return this.fullName_;
  }
  
  getFile() {
    return this.file_;
  }

  getValueList() {
    return this.values_;
  }

  getContainingType() {
    return this.containingType_;
  }

  getOptions() {
    return this.options_;
  }
}

class EnumValueDescriptor {
  getName() {
    return this.name_;
  }

  getNumber() {
    return this.number_;
  }

  getFullName() {
    return this.fullName_;
  }
}

class FileDescriptor {
  getName() {
    return this.name_;
  }

  getPackage() {
    return this.package_;
  }

  getDependencyList() {
    return this.dependencies_;
  }

  getMessageTypeList() {
    return this.messageTypes_;
  }

  getEnumTypeList() {
    return this.enumTypes_;
  }

  getExtensionList() {
    return this.extensions_;
  }

  static Syntax = {
    SYNTAX_UNKNOWN: 0,
    SYNTAX_PROTO2: 2,
    SYNTAX_PROTO3: 3,
  };

  getSyntax() {
    return this.syntax_;
  }
}

class DescriptorPool {
  constructor() {
    this.tables_ = new DescriptorPool.Tables();
  }

  findFileByName(name) {
    return this.tables_.findFile(name);
  }

  buildFile(proto) {
    return new DescriptorBuilder(this, this.tables_).buildFile(proto);
  }

  static Tables = class {
    constructor() {
      this.symbolsByName_ = new Map();
      this.filesByName_ = new Map();
    }

    findSymbol(key) {
      return this.symbolsByName_.get(key);
    }

    findFile(key) {
      return this.filesByName_.get(key);
    }

    addSymbol(fullName, symbol) {
      this.symbolsByName_.set(fullName, symbol);
    }

    addFile(file) {
      this.filesByName_.set(file.getName(), file);
    }
  }
}

class DescriptorBuilder {
  constructor(pool, tables) {
    this.pool_ = pool;
    this.tables_ = tables;
  }

  buildFile(proto) {
    const result = new FileDescriptor();
    this.file_ = result;

    if (!proto.getSyntax() || proto.getSyntax() == "proto2") {
      this.file_.syntax_ = FileDescriptor.Syntax.SYNTAX_PROTO2;
    } else if (proto.getSyntax() == "proto3") {
      this.file_.syntax_ = FileDescriptor.Syntax.SYNTAX_PROTO3;
    }

    result.name_ = proto.getName();
    result.package_ = proto.getPackage();

    this.tables_.addFile(result);

    result.dependencies_ = proto.getDependencyList().map(
      dependency => this.tables_.findFile(dependency)
    );

    result.messageTypes_ = proto.getMessageTypeList().map(
      messageType => this.buildMessage(messageType)
    );
    result.enumTypes_ = proto.getEnumTypeList().map(
      enumType => this.buildEnum(enumType)
    );
    result.extensions_ = proto.getExtensionList().map(
      extension => this.buildExtension(extension)
    );

    this.crossLinkFile(result, proto);

    return result;
  }

  findSymbol(name) {
    return this.pool_.tables_.findSymbol(name);
  }

  lookupSymbol(name, relativeTo) {
    if (name[0] == '.') {
      // Fully-qualified name.
      return this.findSymbol(name.substring(1));
    }

    // Chop off the last component of the scope.
    let scopeToTry = relativeTo.substring(0, relativeTo.lastIndexOf('.'));

    // Append ".name" and try to find.
    scopeToTry += '.' + name;
    return this.findSymbol(scopeToTry);
  }

  addSymbol(fullName, symbol) {
    this.tables_.addSymbol(fullName, symbol);
  }

  buildMessage(proto, parent) {
    const result = new Descriptor();
    const scope = parent ? parent.getFullName() : this.file_.getPackage();

    result.fieldsByNumber_ = new Map();

    result.name_ = proto.getName();
    result.fullName_ = scope ? scope + "." + proto.getName() : proto.getName();
    result.file_ = this.file_;
    result.containingType_ = parent;

    result.oneofDecls_ = proto.getOneofDeclList().map(
      oneofDecl => this.buildOneof(oneofDecl, result)
    );
    result.fields_ = proto.getFieldList().map(
      field => this.buildField(field, result)
    );
    result.nestedTypes_ = proto.getNestedTypeList().map(
      nestedType => this.buildMessage(nestedType, result)
    );
    result.enumTypes_ = proto.getEnumTypeList().map(
      enumType => this.buildEnum(enumType, result)
    );
    result.extensionsRanges_ = proto.getExtensionRangeList().map(
      extensionRange => this.buildExtensionRange(extensionRange, result)
    );
    result.extensions_ = proto.getExtensionList().map(
      extension => this.buildExtension(extension, result)
    );

    result.options_ = proto.getOptions();

    this.addSymbol(result.getFullName(), result);

    return result;
  }

  buildFieldOrExtension(proto, parent, isExtension) {
    const result = new FieldDescriptor();
    const scope = parent ? parent.getFullName() : this.file_.getPackage();

    result.name_ = proto.getName();
    result.fullName_ = scope ? scope + "." + proto.getName() : proto.getName();
    result.file_ = this.file_;
    result.number_ = proto.getNumber();
    result.isExtension_ = isExtension;
    result.proto3Optional_ = proto.getProto3Optional();

    result.type_ = proto.getType();
    result.label_ = proto.getLabel();

    result.hasDefaultValue_ = proto.hasDefaultValue();

    if (proto.hasType()) {
      if (proto.hasDefaultValue()) {
        switch (result.getCppType()) {
          case FieldDescriptor.CppType.CPPTYPE_INT32:
          case FieldDescriptor.CppType.CPPTYPE_INT64:
          case FieldDescriptor.CppType.CPPTYPE_UINT32:
          case FieldDescriptor.CppType.CPPTYPE_UINT64:
            result.defaultValue_ = BigInt(proto.getDefaultValue());
            break;
          case FieldDescriptor.CppType.CPPTYPE_FLOAT:
          case FieldDescriptor.CppType.CPPTYPE_DOUBLE:
            if (proto.getDefaultValue() == "inf") {
              result.defaultValue_ = Infinity;
            } else if (proto.getDefaultValue() == "-inf") {
              result.defaultValue_ = -Infinity;
            } else if (proto.getDefaultValue() == "nan") {
              result.defaultValue_ = NaN;
            } else {
              result.defaultValue_ = Number(proto.getDefaultValue());
            }
            break;
          case FieldDescriptor.CppType.CPPTYPE_BOOL:
            if (proto.getDefaultValue() == "true") {
              result.defaultValue_ = true;
            } else if (proto.getDefaultValue() == "false") {
              result.defaultValue_ = false;
            }
            break;
          case FieldDescriptor.CppType.CPPTYPE_ENUM:
              // This will be filled in when cross-linking.
              break;
          case FieldDescriptor.CppType.CPPTYPE_STRING:
            if (result.getType() == FieldDescriptor.Type.TYPE_BYTES) {
              result.defaultValue_ = proto.getDefaultValue().replace(/\\(\D|\d\d\d)/g, (m, p) => {
                switch (p) {
                  case 'n': return '\n';
                  case 'r': return '\r';
                  case 't': return '\t';
                  case '\\': return '\\';
                  case '\'': return '\'';
                  case '"': return '"';
                }
                return String.fromCharCode(Number.parseInt(p, 8));
              });
            } else {
              result.defaultValue_ = proto.getDefaultValue();
            }
            break;
        }
      } else {
        // No explicit default value
        switch (result.getCppType()) {
          case FieldDescriptor.CppType.CPPTYPE_INT32:
          case FieldDescriptor.CppType.CPPTYPE_INT64:
          case FieldDescriptor.CppType.CPPTYPE_UINT32:
          case FieldDescriptor.CppType.CPPTYPE_UINT64:
          case FieldDescriptor.CppType.CPPTYPE_FLOAT:
          case FieldDescriptor.CppType.CPPTYPE_DOUBLE:
            result.defaultValue_ = 0;
            break;
          case FieldDescriptor.CppType.CPPTYPE_BOOL:
            result.defaultValue_ = false;
            break;
          case FieldDescriptor.CppType.CPPTYPE_ENUM:
             // This will be filled in when cross-linking.
             break;
          case FieldDescriptor.CppType.CPPTYPE_STRING:
            result.defaultValue_ = "";
            break;
          case FieldDescriptor.CppType.CPPTYPE_MESSAGE:
            break;
        }
      }
    }

    if (isExtension) {
      result.extensionScope_ = parent;
    } else {
      result.containingType_ = parent;

      if (proto.hasOneofIndex()) {
        result.containingOneof_ = parent.getOneofDeclList()[proto.getOneofIndex()];
      }
    }

    result.options_ = proto.getOptions();

    return result;
  }

  buildField(proto, parent) {
    return this.buildFieldOrExtension(proto, parent, false);
  }

  buildExtension(proto, parent) {
    return this.buildFieldOrExtension(proto, parent, true);
  }

  buildExtensionRange(proto, parent) {
    return {
      start: proto.getStart(),
      end: proto.getEnd()
    };
  }

  buildOneof(proto, parent) {
    const result = new OneofDescriptor();

    result.name_ = proto.getName();
    result.containingType_ = parent;

    return result;
  }

  buildEnum(proto, parent) {
    const result = new EnumDescriptor();
    const scope = parent ? parent.getFullName() : this.file_.getPackage();

    result.name_ = proto.getName();
    result.fullName_ = scope ? scope + "." + proto.getName() : proto.getName();
    result.file_ = this.file_;
    result.containingType_ = parent;

    result.values_ = proto.getValueList().map(
      value => this.buildEnumValue(value, result)
    );

    result.options_ = proto.getOptions();

    this.addSymbol(result.getFullName(), result);

    return result;
  }

  buildEnumValue(proto, parent) {
    const result = new EnumValueDescriptor();

    result.name_ = proto.getName();
    result.number_ = proto.getNumber();

    let scopeLen = parent.fullName_.length - parent.name_.length;
    result.fullName_ = parent.fullName_.substring(0, scopeLen) + result.name_;

    this.addSymbol(result.getFullName(), result);

    return result;
  }

  crossLinkFile(file, proto) {
    for (const [i, messageType] of file.getMessageTypeList().entries()) {
      this.crossLinkMessage(messageType, proto.getMessageTypeList()[i]);
    }

    for (const [i, extension] of file.getExtensionList().entries()) {
      this.crossLinkField(extension, proto.getExtensionList()[i]);
    }
  }

  crossLinkMessage(message, proto) {
    for (const [i, nestedType] of message.getNestedTypeList().entries()) {
      this.crossLinkMessage(nestedType, proto.getNestedTypeList()[i]);
    }

    for (const [i, field] of message.getFieldList().entries()) {
      this.crossLinkField(field, proto.getFieldList()[i]);
    }

    for (const [i, extension] of message.getExtensionList().entries()) {
      this.crossLinkField(extension, proto.getExtensionList()[i]);
    }

    for (const oneofDecl of message.getOneofDeclList()) {
      oneofDecl.fields_ = [];
    }

    for (const field of message.getFieldList()) {
      const oneofDecl = field.getContainingOneof();
      if (oneofDecl != null) {
        oneofDecl.getFieldList().push(field);
      }
    }
  }

  crossLinkField(field, proto) {
    if (proto.hasExtendee()) {
      field.containingType_ = this.lookupSymbol(proto.getExtendee(), field.getFullName());
    }

    if (proto.hasTypeName()) {
      const type = this.lookupSymbol(proto.getTypeName(), field.getFullName());

      if (field.getCppType() == FieldDescriptor.CppType.CPPTYPE_MESSAGE) {
        field.messageType_ = type;
      } else if (field.getCppType() == FieldDescriptor.CppType.CPPTYPE_ENUM) {
        field.enumType_ = type;

        if (field.hasDefaultValue()) {
          const defaultValue = this.lookupSymbol(
              proto.getDefaultValue(), field.getEnumType().getFullName());
          field.defaultValue_ = defaultValue;
        } else {
          field.defaultValue_ = field.getEnumType().getValueList()[0];
        }
      }
    }

    field.getContainingType().fieldsByNumber_.set(field.getNumber(), field);
  }
}

module.exports = {
  Descriptor,
  FieldDescriptor,
  FileDescriptor,
  DescriptorPool,
};
