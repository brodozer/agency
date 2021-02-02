const { src, dest, parallel, series } = require('gulp');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
//const uglify = require('gulp-uglify-es').default;
const uglify = require('gulp-uglify');
const del = require('del');
const fileinclude = require('gulp-file-include');

sass.compiler = require('node-sass');

let prod = 'prod'; // project folder
let source = 'src'; // source folder

let configServer = {
	server: {
      baseDir: './' + prod
    },
    port: 9000,
    notify: false
};

let path = {
	
	prod: {
		html:  prod + '/',
      js:    prod + '/js/',
      css:   prod + '/css/',
      img:   prod + '/img/',
      fonts: prod + '/fonts/'
	},

	source: {
		html:  source + '/*.html',
		js:    source + '/js/*.js',
		scss:  source + '/scss/style.scss',
		img:   source + '/img/**/*.*',
		fonts: source + '/fonts/**/*.*'
	},

	watch: {
		html:  source + '/**/*.html',
      js:    source + '/js/*.js',
      scss:  source + '/scss/*.scss',
      img:   source + '/img/**/*.*',
      fonts: source + '/fonts/**/*.*'
	},

	clean: {
		del: './' + prod
	}
};

// html
function html() {
	return src(path.source.html)
		.pipe(fileinclude())
		.pipe(gulp.dest(path.prod.html))
		.pipe(browserSync.stream());
}

// css
function css() {
	return src(path.source.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions']
		}))
		.pipe(cleanCss({ 
			level: { 1: { specialComments: 0 } }
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.prod.css))
		.pipe(browserSync.stream())
}

// fonts
function fonts() {
	return src(path.source.fonts)
		.pipe(dest(path.prod.fonts))
		.pipe(browserSync.stream())
}

// js
function js() {
	return src(path.source.js)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.prod.js))
		.pipe(browserSync.stream())
}

// image
function image() {
	return src(path.source.img)
		.pipe(imagemin({
			interlaced: true,
		   progressive: true,
		   svgoPlugins: [{removeViewBox: false}],
		   optimizationLevel:3
		}))
		.pipe(dest(path.prod.img))
		.pipe(browserSync.stream())
}

// server
function webserver() {
	browserSync.init(configServer);
}

//clean
function clean() {
	return del(path.clean.del, { force: true }) 
}

// watch
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.scss], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.fonts], fonts);
	gulp.watch([path.watch.img], image);
}


let build = gulp.series(clean, gulp.parallel(html, css, js, fonts, image)); //build
let watch = gulp.parallel(build, watchFiles, webserver) // watch

exports.build = build;
exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.image = image;
exports.webserver = webserver;
exports.clean = clean;
exports.watch = watch;
exports.default = watch;
exports.build = build;