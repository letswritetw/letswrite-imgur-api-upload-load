// 引用外掛
const gulp = require('gulp'),
			// clean
			del = require('del'),
			// pug
			pug = require('gulp-pug'),
			// postCss
			postcss = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),
			sass = require('gulp-sass'),
			lost = require('lost'),
			rucksack = require('rucksack-css'),
			// 整個sass資料夾import
			bulkSass = require('gulp-sass-bulk-import'),
			// markdown
			markdown = require('gulp-markdown'),
			// ES6
			babel = require("gulp-babel"),
			browserify = require('browserify'),
			babelify = require('babelify'),
			source = require('vinyl-source-stream'),
			// ES6後壓縮
			buffer = require('vinyl-buffer'),
			uglify = require('gulp-uglify'),
			// 壓縮css
			minifyCSS = require('gulp-minify-css'),
			// 重新命名min檔用
			rename = require("gulp-rename"),
			// 偵錯工具
			plumber = require('gulp-plumber'),
			notify = require("gulp-notify"),
			// sourcemap
			sourcemaps = require('gulp-sourcemaps'),
			// bundle
			bundle = require('gulp-bundle-assets'),
			// webServer
			webServer = require('gulp-webserver');

// 路徑
const src_Pug = './pug/*.pug',
			end_Pug = './',
			src_sass = './contents/sass/**/*.sass',
			end_Sass = './contents/css/',
			src_es6js = './contents/js/main.js',
			end_es6js = './contents/js/';

// webServer網址
const serverSite = 'seansu.local';

// sass編譯css的排列
/*
	nested: 一般css，但尾巴在同一行
	expanded: 完整的css排列
	compact: 每一段變成一行
	compressed: 壓縮成一行
*/
const sassCompile = 'compact';

// Pug
gulp.task('template', () => {
	return gulp.src(src_Pug)
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest(end_Pug))
	.pipe(notify({
		message: 'Pug Compily'
	}));
});


// 讓sass可以import css
gulp.task('css', () => {
	gulp.src('assets/vendor/**/*.css')
		.pipe(importCss())
		.pipe(gulp.dest(end_Sass));
});


// postCss
gulp.task('styles', () => {
	var processors = [
		lost,
		rucksack({
			fallbacks: true
		}),
		autoprefixer({
			browsers: ['last 4 version']
		})
	];
	return gulp.src(src_sass)
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass({
			outputStyle: sassCompile
		}).on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(end_Sass));
});

// ES6
gulp.task('es6', () => {
  return browserify({
		// 要編譯哪些檔案
    entries: [src_es6js]
  })
    .transform(babelify.configure({
      presets : ['es2015']
    }))
    .bundle()
    // bundle 後的檔案名稱
		.pipe(source('main.min.js'))
		// 壓縮檔案
		.pipe(buffer())
		.pipe(uglify())
		// bundle 完的檔案要放哪
    .pipe(gulp.dest(end_es6js));
});


// markdown，需要時在拿掉註解
// gulp.task('markdown', () => {
//   return gulp.src(src_mark)
//     .pipe(plumber({
//       errorHandler: notify.onError("Error: <%= error.message %>")
//     }))
//     .pipe(markdown())
//     .pipe(gulp.dest(end_mark))
//     .pipe(notify({
//       message: 'Markdown Success'
//     }));
// });


// 監聽
gulp.task('watch', () => {
	gulp.watch(src_Pug, ['template']);
	gulp.watch(src_sass, ['styles']);
	gulp.watch(src_es6js, ['es6']);
	// gulp.watch(src_mark, ['markdown']);
});


// server
gulp.task('webServer', () => {
	gulp.src('./')
		.pipe(webServer({
			https: {
				key: '/Users/P2120004157/Desktop/ssl/dev.mergebot.com.key',
				cert: '/Users/P2120004157/Desktop/ssl/dev.mergebot.com.crt'
			},
			host: serverSite,
			fallback: 'index.html',
			livereload: true
		}));
});


// cmd輸入"gulp"時，要執行的task
gulp.task('default', ['template', 'styles', 'es6', 'webServer', 'watch']);