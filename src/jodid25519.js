/*
 * Created: 23 May 2014 Guy K. Kloss <gk@mega.co.nz>
 * 
 * Note: Based on original curve255.js (c) 2007, 2013, 2014 Michele Bini.
 *
 * (c) 2014 by the authors under the MIT License.
 *
 * You should have received a copy of the license along with this
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

    var _hexchars = "0123456789abcdef";
    var _hexvalues = {
        "0" : 0,
        "1" : 1,
        "2" : 2,
        "3" : 3,
        "4" : 4,
        "5" : 5,
        "6" : 6,
        "7" : 7,
        "8" : 8,
        "9" : 9,
        "a" : 10,
        "b" : 11,
        "c" : 12,
        "d" : 13,
        "e" : 14,
        "f" : 15
    };
    function _hexencode(n) {
        var c;
        var r = "";
        for (c = 0; c < 255; c += 4) {
            r = _hexchars.substr(core.getbit(n, c)
                                 + (core.getbit(n, c + 1) << 1)
                                 + (core.getbit(n, c + 2) << 2)
                                 + (core.getbit(n, c + 3) << 3), 1)
                + r;
        }
        return r;
    }
    function _hexdecode(n) {
        var c = 0;
        var r = core.zero();
        var l = n.length;
        for (c = 0; (l > 0) && (c < 255); c += 4) {
            l--;
            var v = _hexvalues[n.substr(l, 1)];
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

    function curve25519_raw(f, c) {
        var a, x_1, q;

        x_1 = c;
        //tracev("c", c);
        //tracev("x_1", x_1);
        a = core.dbl(x_1, core.one());
        //tracev("x_a", a[0]);
        //tracev("z_a", a[1]);
        q = [x_1, core.one()];

        var n = 255;

        while (core.getbit(f, n) == 0) {
            n--;
            // For correct constant-time operation, bit 255 should always be set to 1 so the following 'while' loop is never entered
            if (n < 0) {
                return core.zero();
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
            c = core.base();
        }
        f[0] &= 0xFFF8;
        f[15] = (f[15] & 0x7FFF) | 0x4000;
        return curve25519_raw(f, c);
    }

    function _encodeVector(k) {
        var hexKey = _hexencode(k);
        // Pad with '0' at the front.
        hexKey = new Array(64 + 1 - hexKey.length).join('0') + hexKey;
        // Invert bytes.
        return hexKey.split(/(..)/).reverse().join('');
    }
    
    function _decodeVector(v) {
        // assert(length(x) == 64);
        // Invert bytes.
        var hexKey = v.split(/(..)/).reverse().join('');
        return _hexdecode(hexKey);
    }
    
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
    ns.hexencode = _hexencode;

    /**
     * Decodes a hex representation of a point (of the internally used byte order)
     * to an internally compatible array representation.
     *
     * @param n {string}
     *     Hexadecimal string representation of curve point.
     * @returns {array}
     *     Array representation of curve point.
     */
    ns.hexdecode = _hexdecode;
    
    ns.encodeVector = _encodeVector;
    ns.decodeVector = _decodeVector;
    
    return ns;
});
