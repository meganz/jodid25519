#!/usr/bin/env node

// Shim in browser global vars that some libs assume the existence of.
navigator = { appName: "nodejs" };

// Load our library.
var jodid25519 = require(process.argv[2]);

// Debug print our public API.
console.log(jodid25519);
