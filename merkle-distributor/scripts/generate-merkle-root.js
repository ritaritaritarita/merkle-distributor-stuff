"use strict";
exports.__esModule = true;
var fs_1 = require("file-system");
var parse_balance_map_1 = require("../src/parse-balance-map");


var json = JSON.parse(fs_1.readFileSync("holders.json", { encoding: 'utf8' }));
if (typeof json !== 'object')
    throw new Error('Invalid JSON');

fs_1.writeFile("res.json", JSON.stringify(parse_balance_map_1.parseBalanceMap(json)), function(err) {
    if (err) {
        console.log(err);
    }
});
