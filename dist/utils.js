"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var path_helpers_1 = require("./path-helpers");
function upperFirst(s) {
    return s.replace(/^\w/, function (c) { return c.toUpperCase(); });
}
exports.upperFirst = upperFirst;
/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */
function normalizeFilePath(filePath, language) {
    var ext = path_helpers_1.getExtNameFromLanguage(language);
    if (path.extname(filePath) !== ext) {
        return path.join(path.resolve(filePath), 'index' + ext);
    }
    return filePath;
}
exports.normalizeFilePath = normalizeFilePath;
//# sourceMappingURL=utils.js.map