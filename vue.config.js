module.exports = {
    'transpileDependencies': [
        'vuetify'
    ],

    configureWebpack: (config) => {

        // // Don't include dependencies in our production builds of the component, but preserve
        // // them for our demo and npm run serve
        // config.externals = process.env.NODE_ENV === 'production' ? [ 'vue', 'vuetify' ] : undefined;

        // Needed as a workaround to emit .d.ts files when using vue-cli.  Yuck.
        // See https://github.com/vuejs/vue-cli/issues/1081 and related workaround
        // in chainWebpack below
        if(process.env.NODE_ENV === 'production') {
            config.module.rules.forEach(rule => {
                if (rule.use) {
                    let idx = rule.use.findIndex(w => w.loader === 'thread-loader');
                    if (idx !== -1) {
                        rule.use.splice(idx, 1);
                    }
                }
            });
        }

        // This is a big cluster of an attempt to limit the number of "foo.vue" copies show up
        // in the Chrome debugger.  https://github.com/vuejs/vue-cli/issues/2978
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'eval-source-map';
            config.output.devtoolFallbackModuleFilenameTemplate = 'webpack:///[resource-path]?[hash]';
            config.output.devtoolModuleFilenameTemplate = info => {
                const isVue = info.resourcePath.match(/\.vue$/);
                const isScript = info.query.match(/type=script/);
                const hasModuleId = info.moduleId !== '';

                // Detect generated files, filter as webpack-generated
                if (
                    // Must result from vue-loader
                    isVue
                    // Must not be 'script' files (enough for chrome), or must have moduleId (firefox)
                    && (!isScript || hasModuleId)
                ) {
                    let pathParts = info.resourcePath.split('/');
                    const baseName = pathParts[pathParts.length - 1];
                    // prepend 'generated-' to filename as well, so it's easier to find desired files via Ctrl+P
                    pathParts.splice(-1, 1, `generated-${baseName}`);
                    return `webpack-generated:///${pathParts.join('/')}?${info.hash}`;
                }

                // If not generated, filter as webpack-vue
                return `webpack-vue:///${info.resourcePath}`;
            }
        }
    },

    chainWebpack: config => {
        // Needed as a workaround to emit .d.ts files when using vue-cli.  Yuck.
        // See https://github.com/vuejs/vue-cli/issues/1081 and related workaround
        // in configureWebpack above
        if (process.env.NODE_ENV === 'production') {
            // disable cache (not sure if this is actually useful...)
            config.module.rule("ts").uses.delete("cache-loader");

            config.module
                .rule('ts')
                .use('ts-loader')
                .loader('ts-loader')
                .tap(opts => {
                    opts.transpileOnly = false;
                    opts.happyPackMode = false;
                    return opts;
                });
        }
    }
};
