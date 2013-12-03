curve255js
==========

A sample Javascript implementation of the Curve25519 elliptic cryptography function by Daniel J. Bernstein.

```curve25519``` is the main function provided:

````javascript
var shared_secret = curve25519(private_secret, public_key);
````

As in curve25519-donna, some bits in the private key are altered to harden the operation of the function.

Private and public keys are represented by arrays of 16-bit values, starting from the least significant ones:

````
key = arr[0] + arr[1] × 2^16 + arr[2] × 2^32 + … + arr[15] × 2^(16*15)
````

Please note that, while the main function is free of conditional branching, its actual constant-time operation is dependent on the Javascript implementation of numerical operations being also constant-time.

Copyright and MIT licensing
---------------------------

Copyright (c) 2007, 2013 Michele Bini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
