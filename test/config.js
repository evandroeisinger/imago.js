module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [{
        pattern: 'test/e2e/*.html',
        watched: false,
        included: false,
        served: true
    },
    'src/*.js',
    'test/**/*.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
