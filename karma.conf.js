// Karma configuration.

module.exports = function(config) {
  config.set({
    // Base path, that will be used to resolve files and exclude.
    basePath: '',

    // Frameworks to use.
    frameworks: ['mocha', 'chai', 'sinon'],

    // List of files/patterns to load in the browser.
    files: [
        // Dependency-based load order of lib/ modules.
        // (no external dependencies)

        // Ours.
        {pattern: '*.js', included: true},
        'test/test_vectors.js',
        (process.env.CURVE25519_TEST_TIMING) ? 'test/config/test_timing.js' : 'test/config/test_timing_off.js',
        {pattern: 'test/**/*_test.js', included: true},
    ],

    // List of files to exclude.
    exclude: [
    ],

    // Test results reporter to use.
    // Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'.
    reporters: ['progress', 'coverage'],

    // Source files to generate a coverage report for.
    // (Do not include tests or libraries.
    // These files will be instrumented by Istanbul.)
    preprocessors: {
        '*.js': ['coverage']
    },

    // Coverage configuration
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
    },

    // Web server port.
    port: 9876,

    // Enable/disable colours in the output (reporters and logs).
    colors: true,

    // Level of logging.
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG.
    logLevel: config.LOG_INFO,

    // Enable/disable watching file and executing tests whenever any file changes.
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Firefox', 'Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 120000,

    // Continuous Integration mode.
    // If true, it capture browsers, run tests and exit.
    singleRun: false
  });
};
