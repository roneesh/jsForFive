module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/extension',
    filename: "jsForFive.js"
  },
  module: {
    loaders: [
      { 
        test: /\.jsx?$/,         // Match both .js and .jsx files
        exclude: /node_modules/, 
        loader: "babel", 
        query: {
          presets:['react']
        }
      }
    ]
  },
};