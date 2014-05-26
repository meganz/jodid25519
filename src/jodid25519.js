/*
 * Created: 23 May 2014 Guy K. Kloss <gk@mega.co.nz>
 * 
 * Copyright (c) 2014 Mega Limited
 * Copyright (c) 2007, 2013, 2014 Michele Bini
 *
 * Authors: Guy K. Kloss, Michele Bini
 *
 * You should have received a copy of the MIT license along with this
 * program.
 */

define([
    "jodid25519/core",
], function(core) {
    "use strict";
    
    /**
     * @exports jodid25519
     * Curve 25519-based cryptography collection.
     *
     * @description
     * EC Diffie-Hellman based on Curve25519 and digital signatures based on Ed25519.
     */
    var ns = {};

    var _HEXCHARS = "0123456789abcdef";
    
    var _HEXVALUES = (function () {
        var result = {};
        for (var i = 0; i < _HEXCHARS.length; i++) {
            result[_HEXCHARS.charAt(i)] = i;
        }
        return result;
    })();
    
    function _hexencode(n) {
        var c;
        var r = "";
        for (c = 0; c < 255; c += 4) {
            r = _HEXCHARS.substr(core.getbit(n, c)
                                 + (core.getbit(n, c + 1) << 1)
                                 + (core.getbit(n, c + 2) << 2)
                                 + (core.getbit(n, c + 3) << 3), 1)
                + r;
        }
        return r;
    }
    
    function _hexdecode(n) {
        var c = 0;
        var r = core.ZERO();
        var l = n.length;
        for (c = 0; (l > 0) && (c < 255); c += 4) {
            l--;
            var v = _HEXVALUES[n.substr(l, 1)];
            core.setbit(r, c, v & 1);
            v = v >> 1;
            core.setbit(r, c + 1, v & 1);
            v = v >> 1;
            core.setbit(r, c + 2, v & 1);
            v = v >> 1;
            core.setbit(r, c + 3, v & 1);
        }
        return r;
    }
    
    var _BASE32CHARS = "abcdefghijklmnopqrstuvwxyz234567";
    
    var _BASE32VALUES = (function () {
        var result = {};
        for (var i = 0; i < _BASE32CHARS.length; i++) {
            result[_BASE32CHARS.charAt(i)] = i;
        }
        return result;
    })();
    
    function _base32encode(n) {
        var c;
        var r = "";
        for (c = 0; c < 255; c += 5) {
            r = _BASE32CHARS.substr(_getbit(n, c)
                                    + (_getbit(n, c + 1) << 1)
                                    + (_getbit(n, c + 2) << 2)
                                    + (_getbit(n, c + 3) << 3)
                                    + (_getbit(n, c + 4) << 4), 1)
                                    + r;
        }
        return r;
    }
    
    function _base32decode(n) {
        var c = 0;
        var r = core.ZERO();
        var l = n.length;
        for (c = 0; (l > 0) && (c < 255); c += 5) {
            l--;
            var v = _BASE32VALUES[n.substr(l, 1)];
            _setbit(r, c, v & 1);
            v = v >> 1;
            _setbit(r, c + 1, v & 1);
            v = v >> 1;
            _setbit(r, c + 2, v & 1);
            v = v >> 1;
            _setbit(r, c + 3, v & 1);
            v = v >> 1;
            _setbit(r, c + 4, v & 1);
           }
        return r;
    }
    
    function curve25519_raw(f, c) {
        var a, x_1, q;

        x_1 = c;
        //tracev("c", c);
        //tracev("x_1", x_1);
        a = core.dbl(x_1, core.ONE());
        //tracev("x_a", a[0]);
        //tracev("z_a", a[1]);
        q = [x_1, core.ONE()];

        var n = 255;

        while (core.getbit(f, n) == 0) {
            n--;
            // For correct constant-time operation, bit 255 should always be set to 1 so the following 'while' loop is never entered
            if (n < 0) {
                return core.ZERO();
            }
        }
        n--;

        var aq = [a, q];

        while (n >= 0) {
            var r, s;
            var b = core.getbit(f, n);
            r = core.sum(aq[0][0], aq[0][1], aq[1][0], aq[1][1], x_1);
            s = core.dbl(aq[1 - b][0], aq[1 - b][1]);
            aq[1 - b] = s;
            aq[b] = r;
            n--;
        }
        q = aq[1];

        //tracev("x", q[0]);
        //tracev("z", q[1]);
        q[1] = core.invmodp(q[1]);
        //tracev("1/z", q[1]);
        q[0] = core.mulmodp(q[0], q[1]);
        core.reduce(q[0]);
        return q[0];
    }

    function curve25519b32(a, b) {
        return _base32encode(curve25519(_base32decode(a),
                                        _base32decode(b)));
    }

    function curve25519(f, c) {
        if (!c) {
            c = core.BASE();
        }
        f[0] &= 0xFFF8;
        f[15] = (f[15] & 0x7FFF) | 0x4000;
        return curve25519_raw(f, c);
    }

    function _hexEncodeVector(k) {
        var hexKey = _hexencode(k);
        // Pad with '0' at the front.
        hexKey = new Array(64 + 1 - hexKey.length).join('0') + hexKey;
        // Invert bytes.
        return hexKey.split(/(..)/).reverse().join('');
    }
    
    function _hexDecodeVector(v) {
        // assert(length(x) == 64);
        // Invert bytes.
        var hexKey = v.split(/(..)/).reverse().join('');
        return _hexdecode(hexKey);
    }
    
    
    // Expose some functions to the outside through this name space.
    
    /**
     * Computes the scalar product of two points on the curve 25519.
     * Before multiplication, some bit operations are applied to `f` to force it
     * to points on the curve (in case it is not a valid point).
     *
     * @param f {array}
     *     Private point on the curve.
     * @param c {array}
     *     Public point on the curve. If not given, the curve's base point is used.
     * @returns {array}
     *     Key point resulting from scalar product.
     */
    ns.curve25519 = curve25519;

    /**
     * Computes the raw scalar product of two points on the curve 25519.
     *
     * @param f {array}
     *     Private point on the curve.
     * @param c {array}
     *     Public point on the curve. If not given, the curve's base point is used.
     * @returns {array}
     *     Key point resulting from scalar product.
     */
    ns.curve25519_raw = curve25519_raw;

    /**
     * Encodes the internal representation of a point to a hex representation
     * (using the internally used byte order).
     *
     * @param n {array}
     *     Array representation of curve point.
     * @returns {string}
     *     Hexadecimal string representation of curve point.
     */
    ns.hexEncodeVector = _hexEncodeVector;

    /**
     * Decodes a hex representation of a point (of the internally used byte order)
     * to an internally compatible array representation.
     *
     * @param n {string}
     *     Hexadecimal string representation of curve point.
     * @returns {array}
     *     Array representation of curve point.
     */
    ns.hexDecodeVector= _hexDecodeVector;

    /**
     * Encodes the internal representation of a point to a base32 representation
     * (using the internally used byte order).
     *
     * @param n {array}
     *     Array representation of curve point.
     * @returns {string}
     *     Base32 string representation of curve point.
     */
    ns.base32encode = _base32encode;

    /**
     * Decodes a base32 representation of a point (of the internally used byte order)
     * to an internally compatible array representation.
     *
     * @param n {string}
     *     Base32 string representation of curve point.
     * @returns {array}
     *     Array representation of curve point.
     */
    ns.base32decode = _base32decode;
    

    return ns;
});
