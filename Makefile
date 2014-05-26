KARMA  = ./node_modules/.bin/karma
JSDOC  = ./node_modules/.bin/jsdoc

all: test api-doc

test: $(KARMA)
	$(KARMA) start --singleRun=true karma.conf.js --browsers PhantomJS

test-timing:
	CURVE25519_TEST_TIMING=true $(MAKE) test

api-doc: $(JSDOC)
	$(JSDOC) --destination doc/api/ --private \
                 --configure jsdoc.json \
                 curve255.js

$(KARMA) $(JSDOC):
	npm install

clean:
	rm -rf doc/api/ coverage/

.PHONY: test api-doc clean
