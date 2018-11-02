"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var chalk = require("chalk");
var fs = require("fs");
var yaml = require("js-yaml");
var schema = require("graphqlgen-json-schema/dist/schema.json");
var ajv = new Ajv().addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
var validateYaml = ajv.compile(schema);
function parseConfig() {
    if (!fs.existsSync('graphqlgen.yml')) {
        console.error(chalk.default.red("No graphqlgen.yml found"));
        process.exit(1);
    }
    var config = yaml.safeLoad(fs.readFileSync('graphqlgen.yml', 'utf-8'));
    if (!validateYaml(config)) {
        console.error(chalk.default.red("Invalid graphqlgen.yml file"));
        console.error(chalk.default.red(printErrors(validateYaml.errors)));
        process.exit(1);
    }
    return config;
}
exports.parseConfig = parseConfig;
function printErrors(errors) {
    return errors
        .map(function (e) {
        var params = Object.keys(e.params)
            .map(function (key) { return key + ": " + e.params[key]; })
            .join(', ');
        return e.dataPath + " " + e.message + ". " + params;
    })
        .join('\n');
}
//# sourceMappingURL=yaml.js.map