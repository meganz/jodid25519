/**
 * @fileOverview
 * API tests for the ECDH module.
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
    "jodid25519/dh",
    "chai",
], function(ns, chai) {
    "use strict";
    
    var assert = chai.assert;
    
    var _td = _td_dh;

    describe("API tests", function() {
        describe('computeKey() function', function() {
            it('compute pub key', function() {
                var result = ns.computeKey(atob(_td.ALICE_PRIV));
                assert.strictEqual(btoa(result), _td.ALICE_PUB);
            });
            
            it('compute secret key', function() {
                var result = ns.computeKey(atob(_td.ALICE_PRIV),
                                           atob(_td.BOB_PUB));
                assert.strictEqual(btoa(result), _td.SECRET_KEY);
            });
        });

        describe('publicKey() function', function() {
            it('compute pub key', function() {
                var result = ns.publicKey(atob(_td.ALICE_PRIV));
                assert.strictEqual(btoa(result), _td.ALICE_PUB);
            });
            
            it('pub key mismatch', function() {
                var origPrivKey = atob(_td.ALICE_PRIV);
                var modPrivKey = String.fromCharCode(0x42) + origPrivKey.slice(1, 32);
                var result = ns.publicKey(modPrivKey);
                assert.notStrictEqual(btoa(result), _td.ALICE_PUB);
            });
        });
    });
});
