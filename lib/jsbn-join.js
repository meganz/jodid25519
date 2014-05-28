/**
 * @fileOverview
 * Shim to join jsbn.js and jsbn2.js into a single name space.
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
    "jsbn1",
    "jsbn2"
], function(jsbn, jsbn2){
    return jsbn;
});
