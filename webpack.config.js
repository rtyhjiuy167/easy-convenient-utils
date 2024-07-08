const path = require('path')
const glob = require('glob')

const isProduction = process.env.NODE_ENV == 'production'

const list = {};

(async function makeList(dirPath, list) {
    const filesPath = glob.sync(`${dirPath}/**/index.ts`)
    for (let filePath of filesPath) {
        const fileName = filePath.split(/\\/)
            .slice(2)
            .join('/')
            .replace(/(?<=index)\.ts/, '')
        list[`${fileName}`] = `./${filePath}`
    }
    return list
})('packages/lib', list)

const config = {
    entry: list,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        library: '[name]',
        globalObject: 'this',
        libraryTarget: 'umd',
        assetModuleFilename: 'media/[hash:10][ext][query]',
        clean: true
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    }
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production'
    } else {
        config.mode = 'development'
    }
    return config
}