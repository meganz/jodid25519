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
    "asmcrypto",
], function(ns, utils, chai, asmCrypto) {
    "use strict";

    var assert = chai.assert;

    // Shut up warning messages on random number generation for unit tests.
    asmCrypto.random.skipSystemRNGWarning = true;

    var _td = _td_dh;

    describe("Tests for core functions", function() {
        describe('format conversion test', function() {
            it('round trip comparisons hexdecode()/hexencode()', function() {
                for (var i = 0; i < 8; i++) {
                    var middle = utils.hexDecode(_td.TEST_VECTORS_HEX[i][2]);
                    assert.strictEqual(utils.hexEncode(middle),
                                       _td.TEST_VECTORS_HEX[i][2]);
                }
            });
        });
    });
});
