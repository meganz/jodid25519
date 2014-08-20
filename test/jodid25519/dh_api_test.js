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
    "sinon/sandbox",
    "asmcrypto",
], function(ns, chai, sinon_sandbox, asmCrypto) {
    "use strict";

    var assert = chai.assert;

    // Shut up warning messages on random number generation for unit tests.
    asmCrypto.random.skipSystemRNGWarning = true;

    var _td = _td_dh;

    // Create/restore Sinon stub/spy/mock sandboxes.
    var sandbox = null;

    beforeEach(function() {
        sandbox = sinon_sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

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

        describe('generateKey() function', function() {
            var zeros = [0, 0, 0, 0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0, 0, 0, 0];
            var ffs = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                       0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                       0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                       0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

            var _copy = function(forced) {
                var _inner = function(value) {
                    for (var i = 0; i < value.length; i++) {
                        value[i] = forced[i];
                    }
                }
                return _inner;
            };

            it('generate several different private keys', function() {
                var compare = '';
                for (var i = 0; i < 5; i++) {
                    var key = ns.generateKey();
                    assert.lengthOf(key, 32);
                    assert.notStrictEqual(key, compare);
                    compare = key;
                }
            });

            it('valid keys with zeros', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(zeros));
                var expected = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA=';
                assert.strictEqual(btoa(ns.generateKey()), expected);
            });

            it('valid keys with 0xff', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(ffs));
                var expected = '+P///////////////////////////////////////38=';
                assert.strictEqual(btoa(ns.generateKey()), expected);
            });
        });
    });
});
