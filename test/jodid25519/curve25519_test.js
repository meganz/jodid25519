/**
 * @fileOverview
 * Curve25519 compliance tests from file ``curve25519.impl.check.c`` in
 * http://cr.yp.to/ecdh/curve25519-20050915.tar.gz.
 */

/*
 * Copyright (c) 2014 Mega Limited
 * under the MIT License.
 * 
 * Authors: Guy K. Kloss
 * 
 * You should have received a copy of the license along with this program.
 */

define([
    "jodid25519",
    "jodid25519/curve255",
    "chai",
    "asmcrypto",
], function(ns, curve255, chai, asmCrypto) {
    "use strict";

    var assert = chai.assert;

    // Shut up warning messages on random number generation for unit tests.
    asmCrypto.random.skipSystemRNGWarning = true;
    
    function xor(a, b) {
        var result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 16; i++) {
            result[i] = a[i] ^ b[i];
        }
        return result;
    }
    
    function doit(e, k) {
        var ek = curve255.curve25519_raw(e, k);
        return ek;
    }
    
    describe("curve25519 tests)", function() {
        it('run tests', function() {
            var e1 = curve255.hexDecodeVector('3');
            var e2 = curve255.hexDecodeVector('5');
            var k = curve255.hexDecodeVector('9');
            var e1e2k = null;
            for (var l = 0; l < 10; l++) {
                var e1k = doit(e1, k);
                var e2e1k = doit(e2, e1k);
                var e2k = doit(e2, k);
                e1e2k = doit(e1, e2k);
                assert.deepEqual(e1e2k, e2e1k);
                e1 = xor(e1, e2k);
                e2 = xor(e2, e1k);
                k = xor(k, e1e2k);
            }
            assert.deepEqual(e1e2k, curve255.hexDecodeVector(_td_dh.CHAIN_10_HEX));
        });
    });
});
