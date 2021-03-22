let mix = require('laravel-mix');
const webpackConfig = require('./webpack.config');

mix
	.webpackConfig(webpackConfig)
	.ts("src/index.ts", "dist/jautocalc.js")
	.sourceMaps(true)
	.copy("src/typings.d.ts", "dist")
	.minify("dist/jautocalc.js")
	.setPublicPath('dist')
	;
