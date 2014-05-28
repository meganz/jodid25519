/**
 * @fileOverview
 * EC Diffie-Hellman operations on Curve25519.
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
    "jodid25519/curve255",
], function(core, curve255) {
    "use strict";

    /**
     * @exports jodid25519/dh
     * EC Diffie-Hellman operations on Curve25519.
     *
     * @description
     * EC Diffie-Hellman operations on Curve25519.
     */
    var ns = {};

    /**
     * Computes a key through scalar multiplication of a point on the curve 25519.
     *
     * This function is used for the DH key-exchange protocol. It computes a
     * key based on a secret key with a public component (opponent's public key
     * or curve base point if not given) by using scalar multiplication.
     *
     * Before multiplication, some bit operations are applied to the
     * private key to ensure it is a valid Curve25519 secret key.
     * It is the user's responsibility to make sure that the private
     * key is a uniformly random, secret value.
     *
     * @function
     * @param secretKey {string}
     *     Private point as byte string on the curve.
     * @param publicComponent {string}
     *     Public point as byte string on the curve. If not given, the curve's
     *     base point is used.
     * @returns {string}
     *     Key point as byte string resulting from scalar product.
     */
    ns.computeKey = function(secretKey, publicComponent) {
        if (publicComponent) {
            return core.toString(curve255.curve25519(core.fromString(secretKey),
                                                     core.fromString(publicComponent)));
        } else {
            return core.toString(curve255.curve25519(core.fromString(secretKey)));
        }
    };

    /**
     * Computes the public key to a private key on the curve 25519.
     *
     * Before multiplication, some bit operations are applied to the
     * private key to ensure it is a valid Curve25519 secret key.
     * It is the user's responsibility to make sure that the private
     * key is a uniformly random, secret value.
     *
     * @function
     * @param privateKey {string}
     *     Private point as byte string on the curve.
     * @returns {string}
     *     Public key point as byte string resulting from scalar product.
     */
    ns.publicKey = function(privateKey) {
        return core.toString(curve255.curve25519(core.fromString(privateKey)));
    };
    

    return ns;
});
