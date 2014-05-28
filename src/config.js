var requirejs_config_jodid25519 =
({
    paths: {
        "jsbn1": "../lib/jsbn",
        "jsbn2": "../lib/jsbn2",
        "jsbn": "../lib/jsbn-join",
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
        "jsbn1": {
            exports: "jsbn1",
            init: function() {
                return {
                    BigInteger: BigInteger,
                };
            }
        },
        "jsbn2": {
            deps: ["jsbn1"],
            exports: "jsbn2",
        },
        "jsbn": {
            deps: ["jsbn1", "jsbn2"],
            exports: "jsbn",
        },
    },
})
