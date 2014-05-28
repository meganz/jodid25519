/**
 * @fileOverview
 * Timing tests for Curve25519 ECDH.
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
    "jodid25519/curve255",
], function(curve255) {
    "use strict";

    var _td = _td_dh;
    var MIN_TESTS = 50;
    var NUM_TESTS = _td.TEST_VECTORS_HEX.length;
    var MAX_TEST_DURATION = 10000; // Duration in milliseconds.

    var arraySum = function(values) {
        return values.reduce(function(a, b) {
            return a + b;
        }, 0);
    };

    var timeIt = function(timings, f) {
        var start = Date.now();
        var r = f();
        var end = Date.now();
        timings.push(end - start);
        return r;
    };

    var timingStatsText = function(timings) {
        var max = Math.max.apply(null, timings);
        var min = Math.min.apply(null, timings);
        var mean = arraySum(timings) / timings.length;
        var esq = arraySum(timings.map(function(x) { return x * x; })) / timings.length;
        var stdev = Math.sqrt(esq - mean * mean);
        var maxpc = ((max - mean) / mean * 100).toFixed(2);
        var minpc = ((mean - min) / mean * 100).toFixed(2);
        var stdevpc = (stdev / mean * 100).toFixed(2);
        return ("(" + timings.length + " tested): " + mean.toFixed(2)
                + " ms, +" + maxpc + "%, -" + minpc + "%, ~" + stdevpc + "%");
    };

    if (window.TEST_TIMING) {
        // Only run this if we're doing timing tests.
        describe("Curve25519 timing tests:", function() {
            it('curve25519()', function() {
                var timings = [];
                for (var i = 0; arraySum(timings) < MAX_TEST_DURATION
                        && i < NUM_TESTS || i < MIN_TESTS; i++) {
                    // Fields on each record in vector:
                    // e, k, ek
                    var vector = _td.TEST_VECTORS_HEX[i];
                    var e = curve255.hexDecodeVector(vector[0]);
                    var k = curve255.hexDecodeVector(vector[1]);
                    timeIt(timings, function() { return curve255.curve25519(e, k); });
                }
                console.log('Duration per curve25519() call ' + timingStatsText(timings));
            });
            
            it('curve25519_raw()', function() {
                var timings = [];
                for (var i = 0; arraySum(timings) < MAX_TEST_DURATION
                        && i < NUM_TESTS || i < MIN_TESTS; i++) {
                    // Fields on each record in vector:
                    // e, k, ek
                    var vector = _td.TEST_VECTORS_HEX[i];
                    var e = curve255.hexDecodeVector(vector[0]);
                    var k = curve255.hexDecodeVector(vector[1]);
                    timeIt(timings, function() { return curve255.curve25519_raw(e, k); });
                }
                console.log('Duration per curve25519_raw() call ' + timingStatsText(timings));
            });
        });
    }
});
