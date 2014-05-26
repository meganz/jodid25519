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
        describe('checksig() function', function() {
            it('signature R not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var msg = atob(vector[2]);
                var pk = atob(vector[1]);
                var sigOrig = atob(vector[3]).slice(0, 64);
                var sigMod = String.fromCharCode(0x42) + sigOrig.slice(1, 64);
                assert.throws(function() { ns.checksig(sigMod, msg, pk); },
                              'Point is not on curve');
            });

            it('pk not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var msg = atob(vector[2]);
                var pk = String.fromCharCode(0x42) + atob(vector[1]).slice(1, 32);
                var sig = atob(vector[3]).slice(0, 64);
                assert.throws(function() { ns.checksig(sig, msg, pk); },
                              'Point is not on curve');
            });
        });

        describe('signature() function', function() {
            it('signature call without pk', function() {
                var vector = _td.SIGN_INPUT[42];
                var key = atob(vector[0]).slice(0, 32);
                var msg = atob(vector[2]);
                var pk = atob(vector[1]);
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

        describe('isoncurve() function', function() {
            it('for a point on the curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var pk = atob(vector[1]);
                assert.ok(ns.isoncurve(pk));
            });

            it('point not on curve', function() {
                var vector = _td.SIGN_INPUT[42];
                var pk = String.fromCharCode(0x42) + atob(vector[1]).slice(1, 32);
                assert.notOk(ns.isoncurve(pk));
            });
        });

        describe('genkeyseed() function', function() {
            it('generate several different key seeds', function() {
                var compare = '';
                for (var i = 0; i < 5; i++) {
                    var keySeed = ns.genkeyseed();
                    assert.lengthOf(keySeed, 32);
                    assert.notStrictEqual(keySeed, compare);
                    compare = keySeed;
                }
            });
        });
    });
});
