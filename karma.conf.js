// Karma configuration
// Generated on Fri Aug 21 2015 14:34:50 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['browserify', 'tap'],

    files: [
      '__test__/sdk/*.js',
      '__test__/serialize/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
      '__test__/sdk/*.js': ['browserify'],
      '__test__/serialize/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [['babelify', {stage: 0}]]
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: false
  })
}
