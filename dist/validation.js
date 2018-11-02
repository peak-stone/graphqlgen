"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var fs_1 = require("fs");
var ast_1 = require("./ast");
var output_1 = require("./output");
var source_helper_1 = require("./source-helper");
var utils_1 = require("./utils");
var parse_1 = require("./parse");
function validateConfig(config, schema) {
    var language = config.language;
    if (!validateContext(config.context, language)) {
        return false;
    }
    return validateModels(config.models, schema, language);
}
exports.validateConfig = validateConfig;
function validateContext(contextDefinition, language) {
    if (!contextDefinition) {
        return true;
    }
    var validatedContext = validateDefinition('Context', contextDefinition, language);
    if (!validatedContext.validSyntax) {
        console.log(chalk_1.default.redBright("Invalid context: '" + chalk_1.default.bold(validatedContext.definition.rawDefinition) + "' does not follow '" + chalk_1.default.bold('context: <filePath>:<interfaceName>') + "' syntax)"));
        return false;
    }
    if (!validatedContext.fileExists) {
        console.log(chalk_1.default.redBright("Invalid context: file '" + chalk_1.default.bold(validatedContext.definition.filePath) + "' not found"));
        return false;
    }
    if (!validatedContext.interfaceExists) {
        console.log(chalk_1.default.redBright("Invalid context: interface '" + chalk_1.default.bold(validatedContext.definition.modelName) + "' not found in file '" + chalk_1.default.bold(validatedContext.definition.filePath) + "'"));
        return false;
    }
    return true;
}
function validateModels(models, schema, language) {
    var filePaths = !!models.files
        ? models.files.map(function (file) { return ({
            defaultName: typeof file === 'object' ? file.defaultName : undefined,
            path: utils_1.normalizeFilePath(parse_1.getPath(file), language),
        }); })
        : [];
    var overriddenModels = !!models.override ? models.override : {};
    // First test if all files are existing
    if (filePaths.length > 0) {
        var invalidFiles = filePaths.filter(function (file) { return !fs_1.existsSync(parse_1.getPath(file)); });
        if (invalidFiles.length > 0) {
            output_1.outputModelFilesNotFound(invalidFiles.map(function (f) { return f.path; }));
            return false;
        }
    }
    // Then validate all overridden models
    var validatedOverriddenModels = Object.keys(overriddenModels).map(function (typeName) {
        return validateDefinition(typeName, models.override[typeName], language);
    });
    if (!testValidatedDefinitions(validatedOverriddenModels)) {
        return false;
    }
    // Then check whether there's a 1-1 mapping between schema types and models
    return validateSchemaToModelMapping(schema, validatedOverriddenModels, filePaths);
}
function testValidatedDefinitions(validatedOverridenModels) {
    // Check whether the syntax in correct
    if (validatedOverridenModels.some(function (validation) { return !validation.validSyntax; })) {
        output_1.outputWrongSyntaxFiles(validatedOverridenModels);
        return false;
    }
    // Check whether the model file exist
    if (validatedOverridenModels.some(function (validation) { return !validation.fileExists; })) {
        output_1.outputDefinitionFilesNotFound(validatedOverridenModels);
        return false;
    }
    // Check whether the interface inside the model file exist
    if (validatedOverridenModels.some(function (validation) { return !validation.interfaceExists; })) {
        output_1.outputInterfaceDefinitionsNotFound(validatedOverridenModels);
        return false;
    }
    return true;
}
function validateSchemaToModelMapping(schema, validatedOverriddenModels, files) {
    var graphQLTypes = source_helper_1.extractGraphQLTypesWithoutRootsAndInputs(schema);
    var overridenTypeNames = validatedOverriddenModels.map(function (def) { return def.definition.typeName; });
    var interfaceNamesToPath = ast_1.getTypeToFileMapping(files);
    var missingModels = graphQLTypes.filter(function (type) {
        // If some overridden models are mapped to a GraphQL type, consider them valid
        if (overridenTypeNames.some(function (typeName) { return typeName === type.name; })) {
            return false;
        }
        // If an interface is found with the same name as a GraphQL type, consider them valid
        var typeHasMappingWithAFile = Object.keys(interfaceNamesToPath).some(function (interfaceName) {
            var file = interfaceNamesToPath[interfaceName];
            var defaultName = parse_1.getDefaultName(file);
            return interfaceName === replaceDefaultName(type.name, defaultName);
        });
        return !typeHasMappingWithAFile;
    });
    if (missingModels.length > 0) {
        output_1.outputMissingModels(missingModels);
        return false;
    }
    return true;
}
function replaceDefaultName(typeName, defaultName) {
    return defaultName
        ? parse_1.replaceVariablesInString(defaultName, { typeName: typeName })
        : typeName;
}
// Check whether the model definition exists in typescript/flow file
function interfaceDefinitionExistsInFile(filePath, modelName, language) {
    switch (language) {
        case 'typescript':
            return !!ast_1.findTypescriptInterfaceByName(filePath, modelName);
    }
}
function validateDefinition(typeName, definition, language) {
    var validation = {
        definition: {
            typeName: typeName,
            rawDefinition: definition,
        },
        validSyntax: true,
        fileExists: true,
        interfaceExists: true,
    };
    if (definition.split(':').length !== 2) {
        validation.validSyntax = false;
        validation.fileExists = false;
        validation.interfaceExists = false;
        return validation;
    }
    var _a = definition.split(':'), filePath = _a[0], modelName = _a[1];
    validation.definition.filePath = filePath;
    validation.definition.modelName = modelName;
    var normalizedFilePath = utils_1.normalizeFilePath(filePath, language);
    if (!fs_1.existsSync(normalizedFilePath)) {
        validation.fileExists = false;
        validation.interfaceExists = false;
        return validation;
    }
    if (!interfaceDefinitionExistsInFile(normalizedFilePath, modelName, language)) {
        validation.interfaceExists = false;
    }
    return validation;
}
exports.validateDefinition = validateDefinition;
//# sourceMappingURL=validation.js.map