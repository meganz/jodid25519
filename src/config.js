var requirejs_config_jodid25519 =
({
    paths: {
        "jsbn": "../node_modules/jsbn/index",
        "asmcrypto": "../lib/asmcrypto",
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
                return {
                    BigInteger: BigInteger,
                };
            },
        },
    },
})
