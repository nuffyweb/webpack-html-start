const AUTOPREFIXER_BROWSERS = [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 39',
    'Firefox >= 38',
    'Explorer >= 7',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 5'
];
module.exports = () => ({
    ident: 'postcss',
    plugins: {
        'postcss-inline-svg': {},
        'autoprefixer': {
            browsers: AUTOPREFIXER_BROWSERS
        },
      'postcss-import': {},
      'postcss-nested': {},
      'postcss-preset-env': {
        stage: 3,
        browsers: ['last 5 versions', '> 5%'],
        features: {
          'custom-media-queries': true,
        },
      },
    },
  });
