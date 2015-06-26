#!/usr/bin/env node

// Shim in browser global vars that some libs assume the existence of.
navigator = { appName: "nodejs" };
window = { navigator: navigator };

var fs = require("fs");
var path = require("path");

function loadContents(filepath) {
    var file = path.join(__dirname, filepath);
    try {
        var data = fs.readFileSync(file, "utf8");
    } catch (e) {
        console.log("Can't load " + filepath);
        process.exit(1);
    }
    return data;
}

function loadInlineModule(filepath) {
    var old_exports = module.exports;
    delete module.exports; // hopefully force naive libs to go into "browser global" mode
    eval(loadContents(filepath)); // jshint ignore:line
    for (var k in window) {
        this[k] = window[k]; // some modules patch "window", forward this to the real nodejs global object
    }
    var exports = module.exports;
    module.exports = old_exports;
    return exports;
}

// Load our dependencies that we didn't link into our library.
for (var i = 3; i < process.argv.length; i++) {
    loadInlineModule("../" + process.argv[i]);
}

// Load our library.
var jodid25519 = require(process.argv[2]);

// Debug print our public API.
console.log(jodid25519);
