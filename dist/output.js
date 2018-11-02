"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var os = require("os");
var source_helper_1 = require("./source-helper");
function outputDefinitionFilesNotFound(validatedDefinitions) {
    var invalidDefinitions = validatedDefinitions.filter(function (validation) { return !validation.fileExists; });
    console.log("\u274C Some path to model definitions defined in your graphqlgen.yml were not found\n  \n" + chalk_1.default.bold('Step 1') + ": Make sure each of these model definitions point to an existing file\n\n  models:\n    override:\n    " + invalidDefinitions
        .map(function (def) {
        return "  " + def.definition.typeName + ": " + chalk_1.default.redBright(def.definition.filePath) + ":" + def.definition.modelName;
    })
        .join(os.EOL) + "\n\n" + chalk_1.default.bold('Step 2') + ": Re-run " + chalk_1.default.bold('`graphqlgen`'));
}
exports.outputDefinitionFilesNotFound = outputDefinitionFilesNotFound;
function outputWrongSyntaxFiles(validatedDefinitions) {
    var invalidDefinitions = validatedDefinitions.filter(function (validation) { return !validation.validSyntax; });
    console.log("\u274C Some model definitions defined in your graphqlgen.yml have syntax errors\n  \n" + chalk_1.default.bold('Step 1') + ": Make sure each of these model definitions follow the correct syntax\n\n  " + chalk_1.default.cyan("(Correct syntax: " + chalk_1.default.bold('<typeName>') + ": " + chalk_1.default.bold('<filePath>') + ":" + chalk_1.default.bold('<modelName>') + ")") + "\n\n  models:\n    override:\n    " + invalidDefinitions
        .map(function (def) {
        return chalk_1.default.redBright("  " + def.definition.typeName + ": " + def.definition.rawDefinition);
    })
        .join(os.EOL) + "\n\n" + chalk_1.default.bold('Step 2') + ": Re-run " + chalk_1.default.bold('`graphqlgen`'));
}
exports.outputWrongSyntaxFiles = outputWrongSyntaxFiles;
function outputInterfaceDefinitionsNotFound(validatedDefinitions) {
    var invalidDefinitions = validatedDefinitions.filter(function (validation) { return !validation.interfaceExists; });
    console.log("\u274C Some model definitions defined in your graphqlgen.yml were not found\n  \n" + chalk_1.default.bold('Step 1') + ": Make sure each of these model definitions are defined in the following files\n\n  models:\n    override:\n    " + invalidDefinitions
        .map(function (def) {
        return "  " + def.definition.typeName + ": " + def.definition.filePath + ":" + chalk_1.default.redBright(def.definition.modelName);
    })
        .join(os.EOL) + "\n\n" + chalk_1.default.bold('Step 2') + ": Re-run " + chalk_1.default.bold('`graphqlgen`'));
}
exports.outputInterfaceDefinitionsNotFound = outputInterfaceDefinitionsNotFound;
function outputMissingModels(missingModels) {
    console.log("\u274C Some types from your application schema have model definitions that are not defined yet\n  \n" + chalk_1.default.bold('Step 1') + ": Copy/paste the model definitions below to your application\n\n" + missingModels.map(renderModelFromType).join(os.EOL) + "\n\n\n" + chalk_1.default.bold('Step 2') + ": Reference the model definitions in your " + chalk_1.default.bold('graphqlgen.yml') + " file\n\nmodels:\n  files:\n    - ./path/to/your/file.ts  \n\n" + chalk_1.default.bold('Step 3') + ": Re-run " + chalk_1.default.bold('`graphqlgen`'));
}
exports.outputMissingModels = outputMissingModels;
function renderModelFromType(type) {
    return "export interface " + chalk_1.default.bold(type.name) + " {\n" + type.fields
        .map(function (field) { return "  " + field.name + ": " + source_helper_1.graphQLToTypecriptType(field.type); })
        .join(os.EOL) + "\n}";
}
function outputModelFilesNotFound(filesNotFound) {
    console.log("\u274C Some path to model definitions defined in your graphqlgen.yml were not found\n  \n" + chalk_1.default.bold('Step 1') + ": Make sure each of these files exist\n\n  models:\n    files:\n    " + filesNotFound.map(function (file) { return "  - " + chalk_1.default.redBright(file); }).join(os.EOL) + "\n\n" + chalk_1.default.bold('Step 2') + ": Re-run " + chalk_1.default.bold('`graphqlgen`'));
}
exports.outputModelFilesNotFound = outputModelFilesNotFound;
//# sourceMappingURL=output.js.map