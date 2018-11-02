"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_helpers_1 = require("./path-helpers");
function buildModelMap(modelsConfig, outputDir) {
    return Object.keys(modelsConfig).reduce(function (acc, typeName) {
        var _a;
        var modelConfig = modelsConfig[typeName];
        var _b = modelConfig.split(':'), modelPath = _b[0], modelTypeName = _b[1];
        var absoluteFilePath = path_helpers_1.getAbsoluteFilePath(modelPath);
        var importPathRelativeToOutput = path_helpers_1.getImportPathRelativeToOutput(absoluteFilePath, outputDir);
        return __assign({}, acc, (_a = {}, _a[typeName] = {
            absoluteFilePath: absoluteFilePath,
            importPathRelativeToOutput: importPathRelativeToOutput,
            modelTypeName: modelTypeName,
        }, _a));
    }, {});
}
exports.buildModelMap = buildModelMap;
//# sourceMappingURL=modelmap.js.map