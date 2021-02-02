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
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');

sass.compiler = require('node-sass');

let prod = 'prod'; // project folder
let source = 'src'; // source folder

let configServer = {
	server: {
      baseDir: './' + source
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

	app: {
      css:   source + '/css/',
      js:    source + '/js/'
	},

	source: {
		html:  source + '/*.html',
		js:    source + '/js/main.js',
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
		//.pipe(fileinclude())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(path.prod.html))
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
		.pipe(dest(path.app.css))
		.pipe(browserSync.stream())
}

// js
function js() {
	return src(path.source.js)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.prod.js))
}

// js libs
function jsLibs() {
	return gulp.src([ 
		source + '/libs/jquery/jquery.min.js',
		source + 'src/libs/'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.app.js));
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
}

// server
function webserver() {
	browserSync.init(configServer);
}

//clean
function clean() {
	return del(path.clean.del, { force: true }) 
}

//copy files to prod (add path.source.js)
function buildcopy() {
	return src([
		path.source.css,
		path.source.fonts
		], { base: source }) 
	.pipe(dest(prod))
}

// watch
function watchFiles() {
	gulp.watch([path.watch.scss], css);
	gulp.watch(path.watch.js).on('change', browserSync.reload);
	gulp.watch(path.watch.html).on('change', browserSync.reload);
}

let fin = gulp.series(clean, gulp.parallel(buildcopy, image, js, html)); //build
let watch = gulp.parallel(css, watchFiles, webserver) // watch (add jsLibs)

exports.html = html;
exports.css = css;
exports.js = js;
exports.image = image;
exports.webserver = webserver;
exports.clean = clean;
exports.watch = watch;
exports.default = watch;
exports.buildcopy = buildcopy;
exports.fin = fin;