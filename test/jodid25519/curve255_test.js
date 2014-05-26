/**
 * @fileOverview
 * Tests for Michele Bini's curve255.js implementation's key formats.
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
    "jodid25519/curve255",
    "chai",
], function(ns, chai) {
    "use strict";

    var assert = chai.assert;
    
    var _td = _td_dh;

    describe("Tests for curve255 key format compliance", function() {
        describe('NaCl test vectors', function() {
            it('Alice computes her pub key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.ALICE_PRIV_HEX));
                assert.strictEqual(ns.hexEncodeVector(result), _td.ALICE_PUB_HEX);
            });
            
            it('Bob computes his pub key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.BOB_PRIV_HEX));
                assert.strictEqual(ns.hexEncodeVector(result), _td.BOB_PUB_HEX);
            });
            
            it('Alice computes secret key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.ALICE_PRIV_HEX),
                                           ns.hexDecodeVector(_td.BOB_PUB_HEX));
                assert.strictEqual(ns.hexEncodeVector(result), _td.SECRET_KEY_HEX);
            });
            
            it('Bob computes secret key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.BOB_PRIV_HEX),
                                           ns.hexDecodeVector(_td.ALICE_PUB_HEX));
                assert.strictEqual(ns.hexEncodeVector(result), _td.SECRET_KEY_HEX);
            });
        });
    });
    
    describe('format conversion test', function() {
        it('round trip comparisons hexDecodeVector()/hexEncodeVector()', function() {
            for (var i = 0; i < 8; i++) {
                var middle = ns.hexDecodeVector(_td.TEST_VECTORS_HEX[i][2]);
                assert.strictEqual(ns.hexEncodeVector(middle),
                                   _td.TEST_VECTORS_HEX[i][2]);
            }
        });
    });
});
