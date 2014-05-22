/**
 * @fileOverview
 * Curve25519 compliance tests from file ``test-curve25519.c`` in
 * http://cr.yp.to/ecdh/curve25519-20050915.tar.gz.
 */

/*
 * Created: 22 May 2014 Guy K. Kloss <gk@mega.co.nz>
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

    var MAX_TEST_DURATION = 5000; // Duration in milliseconds.
    
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
            var e1 = curve255.hexdecode('3');
            var e2 = curve255.hexdecode('5');
            var k = curve255.hexdecode('9');
            var start = Date.now();
            var l = 0;
            for (l = 0; Date.now() - start < MAX_TEST_DURATION && l < 1000000000; l++) {
                var e1k = doit(e1, k);
                var e2e1k = doit(e2, e1k);
                var e2k = doit(e2, k);
                var e1e2k = doit(e1, e2k);
                assert.deepEqual(e1e2k, e2e1k);
                e1 = xor(e1, e2k);
                e2 = xor(e2, e1k);
                k = xor(k, e1e2k);
            }
            console.log('Processed ' + (4 * l) + ' test-curve25519.c test vectors.');
        });
    });
})();
