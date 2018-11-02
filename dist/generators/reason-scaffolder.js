"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reason_generator_1 = require("./reason-generator");
exports.format = reason_generator_1.format;
var noop = function (s) { return s; };
function generate(args) {
    noop(JSON.stringify(args));
    return 'Reason code scaffolder is not yet implmented';
}
exports.generate = generate;
//# sourceMappingURL=reason-scaffolder.js.map