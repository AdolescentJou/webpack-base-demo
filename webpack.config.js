const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const ConsolePlugin = require('./lib/plugin/console_plugin.js');
const glob = require('glob'); // 文件匹配模式
const fs = require('fs');
const dotenv = require('dotenv');

const PATHS = {
  src: path.join(__dirname, 'src'),
};

const setMpa = () => {
  // 多页面打包的入口集合
  const entry = {};
  // 多页面打包的模板集合
  const htmlWebpackPlugins = [];

  // 借助 glob 获取 src 目录下的所有入口文件
  const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.tsx'));

  // 遍历文件集合，生成所需要的 entry、htmlWebpackPlugins 集合
  entryFiles.map((item, index) => {
    const match = item.match(/src\/(.*)\/index\.jsx$/);
    const pageName = match?.[1];
    entry[pageName] = item;
    // 多页面所需要的模板集合
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        title: pageName,
        filename: `${pageName}.html`,
        template: path.join(__dirname, `src/index.html`),
        chunks: [pageName],
      }),
    );
  });
  // 对外输出页面打包需要的 入口集合
  return { entry, htmlWebpackPlugins };
};

module.exports = (webpackEnv) => {
  const { mode } = webpackEnv;

  //通过mode环境变量，获取对应配置文件
  const dotenvFile = `process.${mode}.env`;

  let env = {};
  if (fs.existsSync(dotenvFile)) {
    env = dotenv.parse(fs.readFileSync(dotenvFile));
  } else {
    throw new Error('错误的环境变量：' + mode);
  }

  // 将配置文件转化为对象
  const raw = Object.keys(env).reduce((_env, key) => {
    _env[key] = JSON.stringify(env[key]);
    return _env;
  }, {});

  // 多页面打包配置
  const { entry, htmlWebpackPlugins } = setMpa();

  return {
    // 入口出口配置
    entry: entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
      publicPath: mode === 'development' ? '/' : './',
    },

    //     devtool:'source-map',

    plugins: [
      // 单页面配置模板html
      //       new HtmlWebpackPlugin({
      //         template: path.resolve(__dirname, 'src/index.html'),
      //       }),
      // 多页面配置模板html
      ...htmlWebpackPlugins,
      // 分离css
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
      }),
      // 打包前先清空目录
      new CleanWebpackPlugin(),
      // 构建速度分析 弃用
      //  new SpeedMeasureWebpackPlugin(),
      //  构建体积分析
      //       new WebpackBundleAnalyzer({
      //         analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      //         generateStatsFile: true, // 是否生成stats.json文件
      //       }),
      // 清除无用的css 必须搭配分离css使用
      new PurgecssWebpackPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }), //nodir 表示不匹配文件夹
      }),
      // 全局注入环境变量
      new webpack.DefinePlugin({
        'process.env': raw,
      }),
      // 生成依赖文件清单
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      //自定义插件
      new ConsolePlugin({name:'111'})
      // 忽略路径引入大小写,webpack5已经内置，不用引用
      // new CaseSensitivePathsWebpackPlugin()
    ],

    // 配置本地服务
    devServer: {
      //     contentBase: path.join(__dirname, 'dist'), //启动后外界访问资源的路径
      static: {
        directory: path.join(__dirname, 'dist'), //启动后外界访问资源的路径
      },
      port: '8080',
      host: 'localhost',
      // 打开模块热替换
      hot: true,
    },

    resolve: {
      // 配置别名
      alias: {
        '~': path.resolve('src'),
        '@': path.resolve('src'),
        components: path.resolve('src/components'),
        react: path.resolve(__dirname, 'node_modules/react/umd/react.development.js'),
      },
      // 配置需要解析的后缀，引入的时候不带扩展名，webpack会从左到右依次解析
      extensions: ['.js', '.jsx', '.json', '.wasm', '.less', '.html', '.css', '...'],
    },

    // 配置内联资源，即打包的时候不必引入，会发额外请求
    //       externals: {
    //         react: 'React',
    //         'react-dom': 'ReactDOM',
    //       },

    // 配置loader
    module: {
      noParse: /react\.development\.js$/,
      rules: [
        // 支持加载css文件
        {
          test: /\.css/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            //     'style-loader',
            'css-loader',
            //     {
            //       loader: 'css-loader',
            //       // 配置css module 启动需要开启 'style-loader', 注释MiniCssExtractPlugin，less-loader
            //       options: {
            //         modules: true,
            //         importLoaders: 1,
            //       },
            //     },
          ],
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src'),
          //   sideEffects: true, // 关闭tree shaking 副作用影响
        },
        {
          test: /\.less/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            'css-loader',
            {
              loader:'less-loader',
              // 将变量注入到less文件中
              options: {
                // additionalData:'body{ background-color: red;};'
              }
            },
            './lib/loader/console_loader.js',
            //     'style-loader',
            //     {
            //       loader: 'css-loader',
            //       // 配置css module 启动需要开启 'style-loader', 注释MiniCssExtractPlugin，less-loader
            //       options: {
            //         modules: true,
            //         importLoaders: 1,
            //       },
            //     },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'postcss-flexbugs-fixes', // 规范flex 布局语法
                    'postcss-normalize', // 删除无意义的css语法
                    [
                      'postcss-preset-env', //通用化css格式
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                    //     'autoprefixer', // 自动给不兼容的css属性加上浏览器前缀
                  ],
                },
              },
            },
          ],
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src'),
          //   sideEffects: true, // 关闭tree shaking 副作用影响
        },
        // 支持加载图片，已弃用，现使用 type: 'asset',
        //       {
        //         test: /.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
        //         use: [
        //           {
        //             loader: 'url-loader',
        //             options: {
        //               limit: 8192,
        //               outputPath: 'images',
        //             },
        //           },
        //         ],
        //       },

        // webpack5新增对图片文件的处理
        {
          test: /\.(jpe?g|png|gif)$/i,
          type: 'asset',
          generator: {
            // 输出文件位置以及文件名
            // [ext] 自带 "." 这个与 url-loader 配置不同
            filename: '[name][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 50 * 1024, //超过50kb不转 base64
            },
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset',
          generator: {
            // 输出文件位置以及文件名
            filename: '[name][chunkhash:8][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 超过100kb不转 base64
            },
          },
        },

        //支持转义ES6/ES7/JSX
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/react'],
                plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]],
                cacheDirectory: true, // 启用缓存
              },
            },
          ],
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        },
        {
          test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
          use: {
            loader: 'babel-loader',
            options: {
              // 预设执行顺序由右往左,所以先处理ts,再处理jsx
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        },
        // 自定义测试loader
        {
          test: /\.js?$/,
          use:[{
            loader:'./lib/loader/promise_loader.js',
          }]
        }
      ],
    },

    // 缓存配置 https://webpack.docschina.org/configuration/cache/#cache
    cache: {
      type: 'filesystem', // 开启持久化缓存
      //     version: createEnvironmentHash(env.raw), // 参考react脚手架的配置 可以记录打包缓存的版本
      cacheDirectory: path.appWebpackCache,
      store: 'pack',
      // 构建依赖，如果有文件修改，则重新执行打包流程
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
      },
    },

    // 优化配置
    optimization: {
      // 启动摇树优化
      usedExports: true,
      // 启用压缩插件压缩代码
      //       minimize: true,
      minimizer: [
        // 配置压缩js
        // new UglifyWebpackPlugin({
        //   parallel: 4, // 使用多进程来运行提高构建速度
        //   uglifyOptions: {
        //     compress: {
        //       drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
        //       drop_debugger: true, //干掉那些debugger;
        //       //     pure_funcs: ['console.log'], // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理   }  }
        //     },
        //   },
        // }),
        // 配置压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        // 与 UglifyWebpackPlugin 效果相同, UglifyWebpackPlugin已经弃用
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
              drop_debugger: true, //干掉那些debugger;
              //     pure_funcs: ['console.log'], // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理   }  }
            },
          },
        }),
      ],

      //代码分割 默认配置
      splitChunks: {
        chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
        minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
        minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
        minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
        maxAsyncRequests: 5, // 最大的按需(异步)加载次数
        maxInitialRequests: 3, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // 配置提取模块的方案
          // 从 webpack 5 开始，不再允许将 entry 名称传递给 {cacheGroup}.test 或者为 {cacheGroup}.name 使用现有的 chunk 的名称。
          defaultVendors: {
            test: /[\/]node_modules[\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name: 'vendors',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: 'default',
          },
          react: {
            test: /(react|react-dom)/, // 匹配chunk的名称
            name: 'react', //打包后的文件名
            chunks: 'all',
            priority: 13, // 优先级 越高则先处理
          },
        },
      },
    },
  };
};
