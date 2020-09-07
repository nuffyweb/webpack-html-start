const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");
const PAGES_DIR = path.join(__dirname, "./src/html/views");
const PAGES = fs
    .readdirSync(PAGES_DIR)
    .filter(fileName => fileName.endsWith(".html"));
const config = {
  entry: ["./src/js/app.js", "./src/scss/app.scss"],
  output: {
    filename: "./js/bundle.js"
  },
  devtool: "source-map",
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: true
      })
    ]
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        },
        {
            test: /\.(sass|scss)$/,
            include: path.resolve(__dirname, "src/scss"),
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {}
              },
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                  url: false
                }
              },
              {
                loader: "postcss-loader",
                options: {
                    config: {
                        path: 'postcss.config.js',
                    },
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"]
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, "src/svg-sprite"),
        use: [
            {loader: 'svg-sprite-loader'},
          {
            loader: 'svgo-loader',
            options: {
                plugins: [
                    {
                        cleanupAttrs: true,
                    }, {
                        removeDoctype: true,
                    }, {
                        removeXMLProcInst: true,
                    }, {
                        removeXMLNS: true,
                    }, {
                        removeViewBox: true,
                    }, {
                        removeComments: true,
                    }, {
                        removeMetadata: true,
                    }, {
                        removeTitle: true,
                    }, {
                        removeDesc: true,
                    }, {
                        removeUselessDefs: true,
                    }, {
                        removeEditorsNSData: true,
                    }, {
                        removeEmptyAttrs: true,
                    }, {
                        removeHiddenElems: true,
                    }, {
                        removeEmptyText: true,
                    }, {
                        removeEmptyContainers: true,
                    }, {
                        removeViewBox: false,
                    }, {
                        cleanupEnableBackground: true,
                    }, {
                        convertStyleToAttrs: true,
                    }, {
                        convertColors: true,
                    }, {
                        convertPathData: true,
                    }, {
                        convertTransform: true,
                    }, {
                        removeUnknownsAndDefaults: true,
                    }, {
                        removeNonInheritableGroupAttrs: true,
                    }, {
                        removeUselessStrokeAndFill: true,
                    }, {
                        removeUnusedNS: true,
                    }, {
                        cleanupIDs: true,
                    }, {
                        cleanupNumericValues: true,
                    }, {
                        moveElemsAttrsToGroup: true,
                    }, {
                        moveGroupAttrsToElems: true,
                    }, {
                        collapseGroups: true,
                    }, {
                        removeRasterImages: false,
                    }, {
                        mergePaths: true,
                    }, {
                        convertShapeToPath: true,
                    }, {
                        sortAttrs: true,
                    }, {
                        removeDimensions: true,
                    }, {
                        removeAttrs: { attrs: '(stroke|fill)' },
                    }
                ]
            }
          }
        ]
    },


    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"
    }),
    new SpriteLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: "./src/fonts",
        to: "./fonts"
      },
      {
        from: "./src/favicon",
        to: "./favicon"
      },
      {
        from: "./src/images",
        to: "./images"
      },
      {
        from: "./src/uploads",
        to: "./uploads"
      }
    ]),
    ...PAGES.map(
        page =>
            new HtmlWebpackPlugin({
                template: `${PAGES_DIR}/${page}`,
                filename: `./${page}`,
                inject: false,
                svgoConfig: {
                    removeTitle: false,
                    removeViewBox: true,
                },
            })
    ),
  ],
//   .concat(htmlPlugins)
devServer: {
  hot: true,
  liveReload: true,
  overlay: true,
  // disableHostCheck: true,
  contentBase: path.join(__dirname, './dist'),
  historyApiFallback: true,
  compress: true,
  port: 8086,
}
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
