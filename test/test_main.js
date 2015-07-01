var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/_test\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

var Object_deep_merge = function(parent, overrides) {
    var obj = {};
    for (var k in parent) {
        obj[k] = parent[k];
    }
    for (var k in overrides) {
        obj[k] = (typeof parent[k] === "object")
                ? Object_deep_merge(parent[k], overrides[k])
                : overrides[k];
    }
    return obj;
};

requirejs.config(Object_deep_merge(requirejs_config_jodid25519, {
    // Karma serves files from '/base'.
    baseUrl: '/base/src',

    // Extra path hacks for tests.
    paths: {
        'sinon': '../node_modules/sinon/lib/sinon',
    },
    shim: {
        'sinon': { exports: 'sinon' },
        'sinon/assert': { exports: 'sinon.assert' },
        'sinon/sandbox': { exports: 'sinon.sandbox' },
        'sinon/spy': { exports: 'sinon.spy' },
        'sinon/stub': { exports: 'sinon.stub' },
    },

    // Ask Require.js to load these files (all our tests).
    deps: tests,

    // Start test run, once Require.js is done.
    callback: window.__karma__.start
}));

mocha.setup({
    timeout: 5000
});
