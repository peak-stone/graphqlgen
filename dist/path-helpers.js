"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function getExtNameFromLanguage(language) {
    var extNames = {
        typescript: '.ts',
    };
    return extNames[language];
}
exports.getExtNameFromLanguage = getExtNameFromLanguage;
// TODO write test cases
function getAbsoluteFilePath(modelPath, language) {
    var absolutePath = path.resolve(modelPath);
    var extName = getExtNameFromLanguage(language);
    if (!fs.existsSync(absolutePath) &&
        fs.existsSync("" + absolutePath + extName)) {
        absolutePath += extName;
    }
    if (!fs.existsSync(absolutePath)) {
        throw new Error(absolutePath + " not found");
    }
    if (!fs.lstatSync(absolutePath).isDirectory()) {
        if (path.extname(absolutePath) !== extName) {
            throw new Error(absolutePath + " has to be a " + extName + " file");
        }
        return absolutePath;
    }
    var indexPath = path.join(absolutePath, 'index' + extName);
    if (!fs.existsSync(indexPath)) {
        throw new Error("No index" + extName + " file found in directory: " + absolutePath);
    }
    return indexPath;
}
exports.getAbsoluteFilePath = getAbsoluteFilePath;
// TODO write test cases
function getImportPathRelativeToOutput(absolutePath, outputDir) {
    var relativePath = path.relative(path.dirname(outputDir), absolutePath);
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    // remove .ts file extension
    relativePath = relativePath.replace(/\.ts$/, '');
    // remove /index
    relativePath = relativePath.replace(/\/index$/, '');
    return relativePath;
}
exports.getImportPathRelativeToOutput = getImportPathRelativeToOutput;
//# sourceMappingURL=path-helpers.js.map