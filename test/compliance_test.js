/**
 * @fileOverview
 * Curve25519 compliance tests with test vectors taken from NaCl tests.
 */

/*
 * Created: 21 May 2014 Guy K. Kloss <gk@mega.co.nz>
 *
 * (c) 2014 by Mega Limited, Wellsford, New Zealand
 *     http://mega.co.nz/
 *     MIT License.
 *
 * You should have received a copy of the license along with this
 * program.
 */

(function() {
    "use strict";

    var assert = chai.assert;

    describe("Curve25519 compliance tests)", function() {
        describe('NaCl test vectors', function() {
            it('Alice computes her pub key', function() {
                var result = curve255.curve25519(_tu.decodeVector(_td.ALICE_PRIV));
                assert.strictEqual(_tu.encodeVector(result), _td.ALICE_PUB);
            });
            
            it('Bob computes his pub key', function() {
                var result = curve255.curve25519(_tu.decodeVector(_td.BOB_PRIV));
                assert.strictEqual(_tu.encodeVector(result), _td.BOB_PUB);
            });
            
            it('Alice computes secret key', function() {
                var result = curve255.curve25519(_tu.decodeVector(_td.ALICE_PRIV),
                                                 _tu.decodeVector(_td.BOB_PUB));
                assert.strictEqual(_tu.encodeVector(result), _td.SECRET_KEY);
            });
            
            it('Bob computes secret key', function() {
                var result = curve255.curve25519(_tu.decodeVector(_td.BOB_PRIV),
                                                 _tu.decodeVector(_td.ALICE_PUB));
                assert.strictEqual(_tu.encodeVector(result), _td.SECRET_KEY);
            });
        });
    });
})();
