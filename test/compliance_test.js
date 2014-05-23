/**
 * @fileOverview
 * Curve25519 compliance tests with test vectors taken from NaCl tests.
 */

/*
 * Created: 21 May 2014 Guy K. Kloss <gk@mega.co.nz>
 *
 * (c) 2014 by the authors under the MIT License.
 *
 * You should have received a copy of the license along with this
 * program.
 */

define([
    "jodid25519",
    "chai",
], function(ns, chai) {
    "use strict";

    var assert = chai.assert;

    describe("Curve25519 compliance tests)", function() {
        describe('NaCl test vectors', function() {
            it('Alice computes her pub key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.ALICE_PRIV));
                assert.strictEqual(ns.hexEncodeVector(result), _td.ALICE_PUB);
            });
            
            it('Bob computes his pub key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.BOB_PRIV));
                assert.strictEqual(ns.hexEncodeVector(result), _td.BOB_PUB);
            });
            
            it('Alice computes secret key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.ALICE_PRIV),
                                           ns.hexDecodeVector(_td.BOB_PUB));
                assert.strictEqual(ns.hexEncodeVector(result), _td.SECRET_KEY);
            });
            
            it('Bob computes secret key', function() {
                var result = ns.curve25519(ns.hexDecodeVector(_td.BOB_PRIV),
                                           ns.hexDecodeVector(_td.ALICE_PUB));
                assert.strictEqual(ns.hexEncodeVector(result), _td.SECRET_KEY);
            });
        });
    });
});
