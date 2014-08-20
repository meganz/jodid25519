/**
 * @fileOverview
 * Tests for internal core functions.
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
    "jodid25519/core",
    "jodid25519/utils",
    "chai",
    "sinon/sandbox",
    "asmcrypto",
], function(ns, utils, chai, sinon_sandbox, asmCrypto) {
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

    describe("Tests for core functions", function() {
        describe('_generateKey()', function() {
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

            it('general test zeros', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(zeros));
                var expected = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
                assert.strictEqual(btoa(ns.generateKey()), expected);
            });

            it('general test zeros, curve25519=false', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(zeros));
                var expected = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
                assert.strictEqual(btoa(ns.generateKey(false)), expected);
            });

            it('general test 0xff', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(ffs));
                var expected = '//////////////////////////////////////////8=';
                assert.strictEqual(btoa(ns.generateKey()), expected);
            });

            it('general test 0xff, curve25519=false', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(ffs));
                var expected = '//////////////////////////////////////////8=';
                assert.strictEqual(btoa(ns.generateKey(false)), expected);
            });

            it('general test zeros, curve25519=true', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(zeros));
                var expected = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA=';
                assert.strictEqual(btoa(ns.generateKey(true)), expected);
            });

            it('general test 0xff, curve25519=true', function() {
                sandbox.stub(asmCrypto, 'getRandomValues', _copy(ffs));
                var expected = '+P///////////////////////////////////////38=';
                assert.strictEqual(btoa(ns.generateKey(true)), expected);
            });
        });
    });
});
