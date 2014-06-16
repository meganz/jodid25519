var requirejs_config_jodid25519 =
({
    paths: {
        "jsbn": "../node_modules/jsbn/index",
        "asmcrypto": "../node_modules/asmcrypto.js/asmcrypto",
    },
    shim: {
        // Dependencies that we use directly need to be added here.
        "asmcrypto": {
            exports: "asmcrypto",
            init: function() {
                return asmCrypto;
            },
        },
        "jsbn": {
            exports: "jsbn",
            init: function(jsbn) {
                // first case is for plain jsbn, second case is for jsbn node module
                return {
                    BigInteger: (typeof BigInteger !== "undefined") ? BigInteger : module.exports,
                };
            },
        },
    },
})
