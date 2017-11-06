module.exports = {
    // メインのJS
    entry: {
      main: "./src/main.js",
      subjects: './src/subjects.js'
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/dist'
    },
    watch: true
  }