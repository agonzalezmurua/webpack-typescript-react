import webpack, { Configuration } from "webpack"
import path from "path"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import ServiceWorkerWebpackPlugin from "serviceworker-webpack-plugin";

module.exports = (env, argv): Configuration => {
    const PRODUCTION = argv.mode === 'production'
    const config: Configuration = {
        entry: path.join(__dirname, 'src', 'index.js'),
        output: {
            filename: '[hash].[name].js',
            path: path.join(__dirname, 'dist'),
            publicPath: "/"
        },
        module: {
            rules: [{
                test: /\.[tj]sx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src")
                ]
            }, {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            parser: 'postcss-scss',
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }
                ]
            }, {
                test: /\.(jpe?g|png|gif|svg|ico|ttf|woff2|woff|eot)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[name].[ext]',
                    outputPath: 'assets/'
                }
            }]
        },
        resolve: {
            plugins: [
                new TsconfigPathsPlugin({configFile: path.join(__dirname, 'tsconfig.json')})
            ],
            extensions: [".tsx", ".ts", ".js", ".jsx", ".scss"]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    },
                    components: {
                        test: /js\/components/,
                        name: "components",
                        chunks: "all"
                    }
                }
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'index.template.html')
            }),
            new webpack.DefinePlugin({
                PRODUCTION
            }),
            new ServiceWorkerWebpackPlugin({
                entry: path.join(__dirname, "src", "sw.js"),
                publicPath: "/"
            }),
            new MiniCssExtractPlugin({
                filename: "[chunkhash].[name].css",
            }),
            new webpack.HashedModuleIdsPlugin(),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    preset: ['default', {discardComments: {removeAll: true}}],
                },
            }),
            new CompressionPlugin()
        ],
        devServer: {
            compress: true,
            historyApiFallback: true,
            proxy: {
                '/socket.io': {
                    target: 'http://localhost:3000',
                    ws: true
                },
                "/auth": "http://localhost:3000",
                "/api": "http://localhost:3000"
            }
        },
    }
    if (argv.analyze) {
        config.plugins!.push(
            new BundleAnalyzerPlugin()
        )
    }

    return config
}
