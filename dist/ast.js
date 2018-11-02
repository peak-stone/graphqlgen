"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var ts = require("typescript");
var parse_1 = require("./parse");
function getChildrenNodes(source) {
    var nodes = [];
    source.forEachChild(function (node) {
        nodes.push(node);
    });
    return nodes;
}
exports.getChildrenNodes = getChildrenNodes;
function getSourceFile(fileName, filePath) {
    return ts.createSourceFile(fileName, fs.readFileSync(filePath).toString(), ts.ScriptTarget.ES2015);
}
function findTypescriptInterfaceByName(filePath, interfaceName) {
    var fileName = path.basename(filePath);
    var sourceFile = getSourceFile(fileName, filePath);
    // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
    return getChildrenNodes(sourceFile).find(function (node) {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration &&
            node.name.escapedText === interfaceName;
    });
}
exports.findTypescriptInterfaceByName = findTypescriptInterfaceByName;
function typeNamesFromTypescriptFile(file) {
    var filePath = parse_1.getPath(file);
    var fileName = path.basename(filePath);
    var sourceFile = getSourceFile(fileName, filePath);
    // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
    return getChildrenNodes(sourceFile)
        .filter(function (node) {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    })
        .map(function (node) { return node.name.escapedText; });
}
/**
 * Create a map of interface names to the path of the file in which they're defined
 * The first evaluated interfaces are always the chosen ones
 */
function getTypeToFileMapping(files) {
    return files.reduce(function (acc, file) {
        var interfaceNames = typeNamesFromTypescriptFile(file).filter(function (interfaceName) { return !acc[interfaceName]; });
        interfaceNames.forEach(function (interfaceName) {
            acc[interfaceName] = file;
        });
        return acc;
    }, {});
}
exports.getTypeToFileMapping = getTypeToFileMapping;
//# sourceMappingURL=ast.js.map