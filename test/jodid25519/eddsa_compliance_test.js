/**
 * @fileOverview
 * Ed25519 compliance tests with test vectors taken from
 * http://ed25519.cr.yp.to/python/sign.input.
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

    var numTests = window.TEST_FULL ? _td.SIGN_INPUT.length : 32;

    describe("Ed25519 compliance tests", function() {
        describe('signing and verification', function() {
            for (var i = 0; i < numTests; i++) {
                (function(i) {
                    it('against known test vector ' + i, function() {
                        // Fields on each record in vector:
                        // key + pk, pk, msg, sign + msg
                        var vector = _td.SIGN_INPUT[i];
                        var key = atob(vector[0]).slice(0, 32);
                        var msg = atob(vector[2]);
                        var pkCheck = atob(vector[1]);
                        var pk = ns.publicKey(key);
                        assert.strictEqual(pk, pkCheck, 'pk mismatch');

                        var sigCheck = atob(vector[3]).slice(0, 64);
                        var sig = ns.sign(msg, key, pk);
                        assert.strictEqual(sig, sigCheck, 'sig mismatch');
                        assert.ok(ns.verify(sig, msg, pk), 'verify mismatch');

                        var badmsg = msg.substring(0, msg.length - 2) + String.fromCharCode(msg.charCodeAt(msg.length - 1) + 1);
                        assert.notEqual(badmsg, msg);
                        assert.notOk(ns.verify(sig, badmsg, pk), 'verify false-positive for bad message');
                    });
                }(i));
            }
        });
    });
});
