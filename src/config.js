var requirejs_config_jodid25519 =
({
    paths: {
        "jsbn": "../node_modules/jsbn/index",
        "asmcrypto": "../node_modules/asmcrypto.js/asmcrypto",
    },
    shim: {
        // Dependencies that we use directly need to be added here.
        "asmcrypto": {
            exports: "asmCrypto",
        },
        "jsbn": {
            exports: "BigInteger",
        },
    },
})
