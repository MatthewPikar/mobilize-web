module.exports = function(config){
    config.set({
        basePath : '../app/',

        files : [
            'components/angular/angular.js',
            'components/angular-resource/angular-resource.js',
            'components/angular-ui-router/release/angular-ui-router.js',
            'components/angular-mocks/angular-mocks.js',
            //'components/bluebird/js/browser/bluebird.min.js',
            //'components/**/*.js',
            'app.js',
            'layout/menuController.js',
            'data/movementService.js',
            'movement/movementController.js',
            'data/actionService.js',
            'actions/actionController.js',
            'search/searchController.js',
            '../tests/unit/*.test.js'
        ],

        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
                'karma-chrome-launcher',
                //'karma-firefox-launcher',
                'karma-jasmine',
                'karma-junit-reporter'
        ],
        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
