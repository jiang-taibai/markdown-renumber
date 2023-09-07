const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    // 在这里添加自定义的Less配置
                },
            },
        },
    },
    chainWebpack: config => {
        config.module
            .rule('json5')
            .test(/\.json5$/)
            .use('json5-loader')
            .loader('json5-loader')
            .end();
    },
    publicPath: './'
})
