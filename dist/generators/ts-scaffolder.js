'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var ts = require('typescript')
var ast_1 = require('../ast')
var ts_generator_1 = require('./ts-generator')
exports.format = ts_generator_1.format

function renderHandler (field, isSub, parentName) {
  const argsArr = field.arguments && field.arguments.length > 0
    ? field.arguments.map(a => a.name)
    : ['args']
  const argsStr = argsArr.length === 1 && argsArr[0] === 'args'
    ? 'args'
    : `{ ${argsArr.join(', ')} }`
  // console.log(field)
  const _parent = isSub
    ? parentName.substr(0, 1).toLowerCase() +
        parentName.substr(1, parentName.length - 1)
    : ''
  return isSub
    ? `\n\n${field.name}: (parent, ${argsStr}, ctx, info) => ctx.db.${_parent}({ id: parent.id }).${field.name}()`
    : `\n\n${field.name}: (parent, ${argsStr}, ctx, info) => ${printFieldLikeTypeEmptyCase(field, argsArr)}`
}

function printFieldLikeTypeEmptyCase (field, args) {
  // if (!field.type.isRequired || field.type.name === 'ID') {
  if (field.type.name === 'ID') {
    return 'null'
  }
  if (field.type.isRequired && field.type.isArray && field.type.isScalar) {
    return '[]'
  }
  if (
    field.type.isRequired &&
    field.type.name === 'String' &&
    field.type.isScalar
  ) {
    return "''"
  }
  if (
    field.type.isRequired &&
    (field.type.name === 'Int' || field.type.name === 'Float') &&
    field.type.isScalar
  ) {
    return '0'
  }
  if (
    field.type.isRequired &&
    field.type.name === 'Boolean' &&
    field.type.isScalar
  ) {
    return 'false'
  }
  // if (field.type.isRequired && !field.type.isScalar) {
  //   return "{ throw new Error('Resolver not implemented') }"
  // }
  if (!field.type.isScalar) {
    const _args = args.length > 1 ? `{ ${args.join(', ')} }` : args[0]
    return `ctx.db.${field.name}(${_args}, info)`
  }
}
function isParentType (name) {
  var parentTypes = ['Query', 'Mutation', 'Subscription']
  return parentTypes.indexOf(name) > -1
}
function shouldRenderField (field, model) {
  var filePath = model.absoluteFilePath
  var interfaceNode = ast_1.findTypescriptInterfaceByName(
    filePath,
    model.modelTypeName
  )
  if (!interfaceNode) {
    throw new Error('No interface found for name ' + model.modelTypeName)
  }
  var interfaceChildNodes = ast_1.getChildrenNodes(interfaceNode)
  var fieldIsInModel = interfaceChildNodes
    .filter(function (childNode) {
      return childNode.kind === ts.SyntaxKind.PropertySignature
    })
    .map(function (childNode) {
      var childNodeProperty = childNode
      var fieldName = childNodeProperty.name.text
      return fieldName
    })
    .some(function (fieldName) {
      return field.name === fieldName
    })
  return !fieldIsInModel
}
function renderResolvers (type, modelMap) {
  var code =
    '  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.\n  // Please do not import this file directly but copy & paste to your application code.\n\n  import { ' +
    type.name +
    "Resolvers } from '[TEMPLATE-INTERFACES-PATH]'\n\n  export const " +
    type.name +
    ': ' +
    type.name +
    'Resolvers.Type = {\n    ...' +
    type.name +
    'Resolvers.defaultResolvers,    ' +
    type.fields
      .filter(function (field) {
        // return shouldRenderField(field, modelMap[type.name])

        return field.type.isObject
      })
      .map(field => {
        // return renderHandler(field, true)
        const ret = renderHandler(field, true, type.name)
        return ret
      }) +
    // .map(function (field) {
    //   return (
    //     '\n      ' +
    //     field.name +
    //     ': (parent' +
    //     (field.arguments.length > 0 ? ', args' : '') +
    //     ") => {\n        throw new Error('Resolver not implemented')\n      }\n    "
    //   )
    // }) +
    '\n  }'
  return { path: type.name + '.ts', force: false, code: code }
}
exports.renderResolvers = renderResolvers
function renderParentResolvers (type) {
  var code =
    '  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.\n  // Please do not import this file directly but copy & paste to your application code.\n\n  import { ' +
    type.name +
    "Resolvers } from '[TEMPLATE-INTERFACES-PATH]'\n  \n  export const " +
    type.name +
    ': ' +
    type.name +
    'Resolvers.Type = {\n    ...' +
    type.name +
    'Resolvers.defaultResolvers,    ' +
    // type.fields.map(function (field) {
    //   const args = field.arguments && field.arguments.length > 0
    //     ? `{ ${field.arguments.map(a => a.name).join(', ')} }`
    //     : 'args'
    //   const _args = field.arguments && field.arguments.length > 0
    //     ? field.arguments.map(a => a.name)
    //     : ['args']
    //   return (
    //     field.name +
    //     // ': (parent' +
    //     // (field.arguments.length > 0 ? ', args' : '') +
    //     // ') => ' +
    //     `: (parent, ${args}, ctx, info) => ` +
    //     printFieldLikeTypeEmptyCase(field, _args)
    //   )
    // }) +
    type.fields.map(field => {
      const ret = renderHandler(field)
      return ret
    }) +
    '\n  }\n      '
  return {
    path: type.name + '.ts',
    force: false,
    code: code
  }
}
exports.renderParentResolvers = renderParentResolvers
function renderExports (types) {
  return (
    "  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.\n  // Please do not import this file directly but copy & paste to your application code.\n\n  import { Resolvers } from '[TEMPLATE-INTERFACES-PATH]'\n    " +
    types
      .filter(function (type) {
        return type.type.isObject
      })
      .map(function (type) {
        return (
          '\n      import { ' +
          type.name +
          " } from './" +
          type.name +
          "'\n    "
        )
      })
      .join(';') +
    '\n\n    export const resolvers: Resolvers = {\n      ' +
    types
      .filter(function (type) {
        return type.type.isObject
      })
      .map(function (type) {
        return '' + type.name
      })
      .join(',') +
    '\n    }'
  )
}
exports.renderExports = renderExports
function generate (args) {
  var files = args.types
    .filter(function (type) {
      return type.type.isObject
    })
    .filter(function (type) {
      return !isParentType(type.name)
    })
    .map(function (type) {
      return renderResolvers(type, args.modelMap)
    })
  files = files.concat(
    args.types
      .filter(function (type) {
        return type.type.isObject
      })
      .filter(function (type) {
        return isParentType(type.name)
      })
      .map(renderParentResolvers)
  )
  files.push({
    path: 'index.ts',
    force: false,
    code: renderExports(args.types)
  })
  return files
}
exports.generate = generate
// # sourceMappingURL=ts-scaffolder.js.map
