#!/usr/bin/env node

// Shim in browser global vars that some libs assume the existence of.
navigator = { appName: "nodejs" };

var fs = require("fs");
var path = require("path");

function loadContents(filepath) {
    var file = path.join(__dirname, filepath);
    try {
        var data = fs.readFileSync(file, "utf8");
    } catch (e) {
        console.log("Can't load " + path);
        process.exit(1);
    }
    return data;
}

function loadInlineModule(filepath) {
    var old_exports = module.exports;
    eval(loadContents(filepath));
    var exports = module.exports;
    module.exports = old_exports;
    return exports;
}

// Load our dependencies that we didn't link into our lib.
for (var i = 3; i < process.argv.length; i++) {
    eval(loadContents("../lib/" + process.argv[i] + ".js"));
}

// Load our library.
var jodid25519 = loadInlineModule(process.argv[2]);

// Debug print our public API.
console.log(jodid25519);
