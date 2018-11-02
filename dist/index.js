#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var chalk_1 = require("chalk");
var mkdirp = require("mkdirp");
var prettier = require("prettier");
var rimraf = require("rimraf");
var yargs = require("yargs");
var source_helper_1 = require("./source-helper");
var path_helpers_1 = require("./path-helpers");
var ts_generator_1 = require("./generators/ts-generator");
// import {
//   generate as generateReason,
//   format as formatReason,
// } from './generators/reason-generator'
// import {
//   generate as generateFlow,
//   format as formatFlow,
// } from './generators/flow-generator'
var ts_scaffolder_1 = require("./generators/ts-scaffolder");
// import { generate as scaffoldFlow } from './generators/flow-scaffolder'
// import { generate as scaffoldReason } from './generators/reason-scaffolder'
var parse_1 = require("./parse");
var validation_1 = require("./validation");
function getTypesGenerator(language) {
    switch (language) {
        case 'typescript':
            return { generate: ts_generator_1.generate, format: ts_generator_1.format };
        // case 'flow':
        //   return { generate: generateFlow, format: formatFlow }
    }
    //TODO: This should never be reached as we validate the yaml before
    throw new Error("Invalid language: " + language);
}
function getResolversGenerator(language) {
    switch (language) {
        case 'typescript':
            return { generate: ts_scaffolder_1.generate, format: ts_generator_1.format };
        // case 'flow':
        //   return { generate: scaffoldFlow, format: formatFlow }
    }
    //TODO: This should never be reached as we validate the yaml before
    throw new Error("Invalid language: " + language);
}
function generateTypes(generateArgs, generateCodeArgs) {
    var generatorFn = getTypesGenerator(generateCodeArgs.language);
    var generatedTypes = generatorFn.generate(generateArgs);
    return generateCodeArgs.prettify
        ? generatorFn.format(generatedTypes, generateCodeArgs.prettifyOptions)
        : generatedTypes;
}
function generateResolvers(generateArgs, generateCodeArgs) {
    var generatorFn = getResolversGenerator(generateCodeArgs.language);
    var generatedResolvers = generatorFn.generate(generateArgs);
    return generatedResolvers.map(function (r) {
        return {
            path: r.path,
            force: r.force,
            code: generateCodeArgs.prettify
                ? generatorFn.format(r.code, generateCodeArgs.prettifyOptions)
                : r.code,
        };
    });
}
function generateCode(generateCodeArgs) {
    var generateArgs = {
        types: source_helper_1.extractGraphQLTypes(generateCodeArgs.schema),
        enums: source_helper_1.extractGraphQLEnums(generateCodeArgs.schema),
        unions: source_helper_1.extractGraphQLUnions(generateCodeArgs.schema),
        context: parse_1.parseContext(generateCodeArgs.config.context, generateCodeArgs.config.output),
        modelMap: generateCodeArgs.modelMap,
    };
    var generatedTypes = generateTypes(generateArgs, generateCodeArgs);
    var generatedResolvers = generateResolvers(generateArgs, generateCodeArgs);
    // const generatedModels = generateModels(generateArgs, {schema, prettify, prettifyOptions, language})
    return { generatedTypes: generatedTypes, generatedResolvers: generatedResolvers };
}
exports.generateCode = generateCode;
function writeTypes(types, config) {
    // Create generation target folder, if it does not exist
    // TODO: Error handling around this
    mkdirp.sync(path.dirname(config.output));
    try {
        fs.writeFileSync(config.output, types, { encoding: 'utf-8' });
    }
    catch (e) {
        console.error(chalk_1.default.red("Failed to write the file at " + config.output + ", error: " + e));
        process.exit(1);
    }
    console.log(chalk_1.default.green("Resolver interface definitons & default resolvers generated at " + config.output));
}
function writeResolversScaffolding(resolvers, config) {
    if (!config['resolver-scaffolding']) {
        return;
    }
    var outputResolversDir = config['resolver-scaffolding'].output;
    rimraf.sync(outputResolversDir);
    resolvers.forEach(function (f) {
        var writePath = path.join(outputResolversDir, f.path);
        mkdirp.sync(path.dirname(writePath));
        try {
            fs.writeFileSync(writePath, f.code.replace('[TEMPLATE-INTERFACES-PATH]', path_helpers_1.getImportPathRelativeToOutput(path_helpers_1.getAbsoluteFilePath(config.output, config.language), writePath)), {
                encoding: 'utf-8',
            });
        }
        catch (e) {
            console.error(chalk_1.default.red("Failed to write the file at " + outputResolversDir + ", error: " + e));
            process.exit(1);
        }
    });
    console.log(chalk_1.default.green("Resolvers scaffolded at " + outputResolversDir));
    process.exit(0);
}
function bootstrapYamlFile() {
    var yaml = "# The target programming language for the generated code\nlanguage: typescript\n\n# The file path pointing to your GraphQL schema\nschema: <path-to-your-schema>.graphql\n\n# Type definition for the resolver context object\ncontext: <path-to-file>:<name-of-interface>\n\n# Map SDL types from the GraphQL schema to TS models\nmodels:\n  files:\n    - <path-to-file>.ts\n\n# Generated typings for resolvers and default resolver implementations\n# Please don't edit this file but just import from here\noutput: <path-to-generated-file>/graphqlgen.ts\n\n# Temporary scaffolded resolvers to copy and paste in your application\nresolver-scaffolding:\n  output: <path-to-output-dir>\n  layout: file-per-type\n";
    var outputPath = path.join(process.cwd(), 'graphqlgen.yml');
    if (fs.existsSync(outputPath)) {
        return console.log(chalk_1.default.red('graphqlgen.yml file already exists'));
    }
    try {
        fs.writeFileSync(outputPath, yaml, {
            encoding: 'utf-8',
        });
    }
    catch (e) {
        return console.error(chalk_1.default.red("Failed to write the graphqlgen.yml file, error: " + e));
    }
    console.log(chalk_1.default.green('graphqlgen.yml file created'));
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var argv, config, parsedSchema, options, modelMap, _a, generatedTypes, generatedResolvers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    argv = yargs
                        .usage('Usage: graphqlgen or gg')
                        .alias('i', 'init')
                        .describe('i', 'Initialize a graphqlgen.yml file')
                        .alias('v', 'version')
                        .describe('v', 'Print the version of graphqlgen')
                        .version()
                        .strict()
                        .help('h')
                        .alias('h', 'help').argv;
                    if (argv.i) {
                        bootstrapYamlFile();
                        return [2 /*return*/, true];
                    }
                    config = parse_1.parseConfig();
                    parsedSchema = parse_1.parseSchema(config.schema);
                    return [4 /*yield*/, prettier.resolveConfig(process.cwd())];
                case 1:
                    options = (_b.sent()) || {} // TODO: Abstract this TS specific behavior better
                    ;
                    if (JSON.stringify(options) !== '{}') {
                        console.log(chalk_1.default.blue("Found a prettier configuration to use"));
                    }
                    if (!validation_1.validateConfig(config, parsedSchema)) {
                        return [2 /*return*/, false];
                    }
                    modelMap = parse_1.parseModels(config.models, parsedSchema, config.output, config.language);
                    _a = generateCode({
                        schema: parsedSchema,
                        language: config.language,
                        prettify: true,
                        prettifyOptions: options,
                        config: config,
                        modelMap: modelMap,
                    }), generatedTypes = _a.generatedTypes, generatedResolvers = _a.generatedResolvers;
                    writeTypes(generatedTypes, config);
                    writeResolversScaffolding(generatedResolvers, config);
                    return [2 /*return*/];
            }
        });
    });
}
// Only call run when running from CLI, not when included for tests
if (require.main === module) {
    run();
}
//# sourceMappingURL=index.js.map