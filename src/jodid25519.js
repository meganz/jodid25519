/*
 * Copyright (c) 2014 Mega Limited
 * under the MIT License.
 * 
 * Authors: Guy K. Kloss
 * 
 * You should have received a copy of the license along with this program.
 */

define([
    "jodid25519/dh",
    "jodid25519/eddsa",
    "jodid25519/curve255",
    "jodid25519/utils",
], function(dh, eddsa, curve255, utils) {
    "use strict";
    
    /**
     * @exports jodid25519
     * Curve 25519-based cryptography collection.
     *
     * @description
     * EC Diffie-Hellman (ECDH) based on Curve25519 and digital signatures
     * (EdDSA) based on Ed25519.
     */
    var ns = {};
    
    /** Module version indicator as string (format: [major.minor.patch]). */
    ns.VERSION = '0.7.1';

    ns.dh = dh;
    ns.eddsa = eddsa;
    ns.curve255 = curve255;
    ns.utils = utils;

    return ns;
});
