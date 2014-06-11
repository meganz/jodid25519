# Build directory.
BUILDDIR = build

# Libraries to omit when building jodid25519-shared.js.
PARTIAL_OMIT = asmcrypto jsbn

# Set to none for a non-minified build, for easier debugging.
OPTIMIZE = none

KARMA  = ./node_modules/.bin/karma
JSDOC  = ./node_modules/.bin/jsdoc
R_JS   = ./node_modules/.bin/r.js
ALMOND = ./node_modules/almond/almond
R_JS_ALMOND_OPTS = baseUrl=src name=../$(ALMOND) wrap.startFile=almond.0 wrap.endFile=almond.1
UGLIFY = ./node_modules/.bin/uglifyjs
ASMCRYPTO_MODULES = utils,aes-cbc,aes-ccm,sha1,sha256,sha512,hmac-sha1,hmac-sha256,hmac-sha512,pbkdf2-hmac-sha1,pbkdf2-hmac-sha256,pbkdf2-hmac-sha512,rng,bn,rsa-pkcs1,globals-rng,globals

all: test api-doc dist test-shared

test-timing:
	KARMA_FLAGS='--preprocessors=' TEST_TIMING=true $(MAKE) test

test-full:
	KARMA_FLAGS='--preprocessors=' TEST_FULL=true $(MAKE) test

test: $(KARMA)
	$(KARMA) start $(KARMA_FLAGS) --singleRun=true karma.conf.js --browsers PhantomJS

api-doc: $(JSDOC)
	$(JSDOC) --destination doc/api/ --private \
                 --configure jsdoc.json \
                 --recurse src/

$(BUILDDIR)/build-config-static.js: src/config.js Makefile
	mkdir -p $(BUILDDIR)
	tail -n+2 "$<" > "$@"

$(BUILDDIR)/build-config-shared.js: src/config.js Makefile
	mkdir -p $(BUILDDIR)
	tail -n+2 "$<" > "$@.tmp"
	for i in $(PARTIAL_OMIT); do \
		sed -i -e "s,lib/$$i\",build/$$i-dummy\"," "$@.tmp"; \
		touch $(BUILDDIR)/$$i-dummy.js; \
	done
	mv "$@.tmp" "$@"

$(BUILDDIR)/jodid25519-static.js: build-static
build-static: $(R_JS) $(BUILDDIR)/build-config-static.js
	$(R_JS) -o $(BUILDDIR)/build-config-static.js out="$(BUILDDIR)/jodid25519-static.js" \
	  $(R_JS_ALMOND_OPTS) include=jodid25519 optimize=$(OPTIMIZE)

$(BUILDDIR)/jodid25519-shared.js: build-shared
build-shared: $(R_JS) $(BUILDDIR)/build-config-shared.js
	$(R_JS) -o $(BUILDDIR)/build-config-shared.js out="$(BUILDDIR)/jodid25519-shared.js" \
	  $(R_JS_ALMOND_OPTS) include=jodid25519 optimize=$(OPTIMIZE)

test-static: test/build-test-static.js build-static
	./$< ../$(BUILDDIR)/jodid25519-static.js

test-shared: test/build-test-shared.js build-shared
	./$< ../$(BUILDDIR)/jodid25519-shared.js $(PARTIAL_OMIT)

$(BUILDDIR)/%.min.js: $(BUILDDIR)/%.js
	$(UGLIFY) $< -o $@ --source-map $@.map --mangle --compress --lint

dist: $(BUILDDIR)/jodid25519-shared.min.js $(BUILDDIR)/jodid25519-static.js

dependencies:
	npm install
	cd node_modules/asmcrypto.js &&	npm install && node_modules/.bin/grunt --with=$(ASMCRYPTO_MODULES)
	cd ../..

$(KARMA) $(JSDOC) $(R_JS) $(UGLIFY): dependencies

clean:
	rm -rf doc/api/ coverage/ build/ lib/

.PHONY: all test api-doc clean
.PHONY: build-static build-shared test-static test-shared dist
