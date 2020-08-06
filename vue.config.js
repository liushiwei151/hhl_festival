// vue.config.js
const Version = process.env.npm_package_version;
module.exports = {
  publicPath: "./",
  // 打包路径
  outputDir: "dist",
  configureWebpack: {
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.js】
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`
    }
  },
  // 静态资源路径
  assetsDir: "assets",
  // 设置是否在开发环境下每次保存代码时都启用eslint
  lintOnSave: true,
  productionSourceMap: true, // 不需要生产环境的 source map 设置false（减小dist文件大小，加速构建）
  devServer: {
    open: true, // npm run serve后自动打开页面
    host: "0.0.0.0", // 匹配本机IP地址(默认是0.0.0.0)
    port: 8080 // 开发服务器运行端口号
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "流逝之光";
      return args;
    });
  },

  pwa: {
    iconPaths: {
      favicon32: "./icon.jpg",
      favicon16: "./icon.jpg",
      appleTouchIcon: "./icon.jpg",
      maskIcon: "./icon.jpg",
      msTileImage: "./icon.jpg"
    }
  }
};
