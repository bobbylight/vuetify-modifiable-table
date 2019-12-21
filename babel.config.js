module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    // This should exclude dependencies such as polyfills, since we're a
    // library we want the consuming app to supply these.  However it seems
    // some stuff still seeps through and we are bigger than we need to be.
    // See https://github.com/vuejs/vue-cli/issues/1919
    ['@vue/app', {
      useBuiltIns: false
    }]
  ]
};
