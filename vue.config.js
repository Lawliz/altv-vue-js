const { join } = require('path')

module.exports = {
    chainWebpack: config => {
        config.module.rule('vue')
        config
            .plugin('html')
            .tap(args => {
                args[0].template = './public/index.html'
                return args
            })
    },
    outputDir: join(__dirname, "../your/path"),
    publicPath: './',
    indexPath: './index.html',
    devServer: {
        port: 8080,
        open: true
    }
}
