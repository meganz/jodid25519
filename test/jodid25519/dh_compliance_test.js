/**
 * @fileOverview
 * Curve25519 compliance tests with test vectors taken from NaCl tests.
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

    describe("Curve25519 compliance tests)", function() {
        describe('NaCl test vectors', function() {
            it('Alice computes her pub key', function() {
                var result = ns.curve25519(atob(_td.ALICE_PRIV));
                assert.strictEqual(btoa(result), _td.ALICE_PUB);
            });
            
            it('Bob computes his pub key', function() {
                var result = ns.curve25519(atob(_td.BOB_PRIV));
                assert.strictEqual(btoa(result), _td.BOB_PUB);
            });
            
            it('Alice computes secret key', function() {
                var result = ns.curve25519(atob(_td.ALICE_PRIV),
                                           atob(_td.BOB_PUB));
                assert.strictEqual(btoa(result), _td.SECRET_KEY);
            });
            
            it('Bob computes secret key', function() {
                var result = ns.curve25519(atob(_td.BOB_PRIV),
                                           atob(_td.ALICE_PUB));
                assert.strictEqual(btoa(result), _td.SECRET_KEY);
            });
        });
    });
});
