/**
 * @fileOverview
 * API tests for the EdDSA module.
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
    "jodid25519/eddsa",
    "chai",
], function(ns, chai) {
    "use strict";
    
    var assert = chai.assert;
    
    var _td = _td_eddsa;

    describe("API tests", function() {
        describe('checkSig() function', function() {
            it('signature R not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var msg = atob(vector[2]);
                var pk = atob(vector[1]);
                var sigOrig = atob(vector[3]).slice(0, 64);
                var sigMod = String.fromCharCode(0x42) + sigOrig.slice(1, 64);
                assert.throws(function() { ns.checkSig(sigMod, msg, pk); },
                              'Point is not on curve');
            });

            it('pk not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var msg = atob(vector[2]);
                var pk = String.fromCharCode(0x42) + atob(vector[1]).slice(1, 32);
                var sig = atob(vector[3]).slice(0, 64);
                assert.throws(function() { ns.checkSig(sig, msg, pk); },
                              'Point is not on curve');
            });

            it('good signature', function() {
                var vector = _td.SIGN_INPUT[42];
                var msg = atob(vector[2]);
                var pk = atob(vector[1]);
                var sig = atob(vector[3]).slice(0, 64);
                assert.ok(ns.checkSig(sig, msg, pk));
            });
        });

        describe('signature() function', function() {
            it('signature call with pk', function() {
                var vector = _td.SIGN_INPUT[42];
                var key = atob(vector[0]).slice(0, 32);
                var msg = atob(vector[2]);
                var pk = atob(vector[1]);
                var sigCheck = atob(vector[3]).slice(0, 64);
                var sig = ns.signature(msg, key, pk);
                assert.strictEqual(sig, sigCheck);
            });

            it('signature call without pk', function() {
                var vector = _td.SIGN_INPUT[42];
                var key = atob(vector[0]).slice(0, 32);
                var msg = atob(vector[2]);
                var sigCheck = atob(vector[3]).slice(0, 64);
                var sig = ns.signature(msg, key);
                assert.strictEqual(sig, sigCheck);
            });

            it('pk not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var key = atob(vector[0]).slice(0, 32);
                var msg = atob(vector[2]);
                var pk = String.fromCharCode(0x42) + atob(vector[1]).slice(1, 32);
                var sigCheck = atob(vector[3]).slice(0, 64);
                var sig = ns.signature(msg, key, pk);
                assert.notStrictEqual(sig, sigCheck);
            });
        });

        describe('isOnCurve() function', function() {
            it('for a point on the curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var pk = atob(vector[1]);
                assert.ok(ns.isOnCurve(pk));
            });

            it('point not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var pk = String.fromCharCode(0x42) + atob(vector[1]).slice(1, 32);
                assert.notOk(ns.isOnCurve(pk));
            });
        });

        describe('genKeySeed() function', function() {
            it('generate several different key seeds', function() {
                var compare = '';
                for (var i = 0; i < 5; i++) {
                    var keySeed = ns.genKeySeed();
                    assert.lengthOf(keySeed, 32);
                    assert.notStrictEqual(keySeed, compare);
                    compare = keySeed;
                }
            });
        });

        describe('publicKey() function', function() {
            it('derive public key', function() {
                var vector = _td.SIGN_INPUT[42];
                var key = atob(vector[0]).slice(0, 32);
                var keyCheck = atob(vector[1]);
                assert.strictEqual(ns.publicKey(key), keyCheck);
            });
        });
    });
});
