module.exports = {
    // メインのJS
    entry: {
      main: "./src/js/main.js",
      subjects: './src/js/subjects.js'
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/dist'
    },
    watch: true
  }