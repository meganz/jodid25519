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
    "chai",
], function(ns, chai) {
    "use strict";

    var assert = chai.assert;

    describe("Tests for core functions", function() {
        describe('format conversion test', function() {
            it('round trip comparisons hexdecode()/hexencode()', function() {
                for (var i = 0; i < 8; i++) {
                    var middle = ns.hexdecode(_td.TEST_VECTORS_HEX[i][2]);
                    assert.strictEqual(ns.hexencode(middle),
                                       _td.TEST_VECTORS_HEX[i][2]);
                }
            });
        });
    });
});
