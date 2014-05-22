/**
 * @fileOverview
 * Some utils to help testing.
 */

var _tu = {};

(function() {
    "use strict";

    _tu.encodeVector = function(k) {
        var hexKey = curve255.hexencode(k);
        // Pad with '0' at the front.
        hexKey = new Array(64 + 1 - hexKey.length).join('0') + hexKey;
        // Invert bytes.
        return hexKey.split(/(..)/).reverse().join('');
    };
    
    _tu.decodeVector = function(v) {
        // assert(length(x) == 64);
        // Invert bytes.
        var hexKey = v.split(/(..)/).reverse().join('');
        return curve255.hexdecode(hexKey);
    };
})();
