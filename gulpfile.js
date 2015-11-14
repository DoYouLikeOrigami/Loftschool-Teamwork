// ██████╗ ██╗     ██╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
// ██╔══██╗██║     ██║   ██║██╔════╝ ██║████╗  ██║██╔════╝
// ██████╔╝██║     ██║   ██║██║  ███╗██║██╔██╗ ██║███████╗
// ██╔═══╝ ██║     ██║   ██║██║   ██║██║██║╚██╗██║╚════██║
// ██║     ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
// ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

var
	gulp        = require('gulp'),
	compass     = require('gulp-compass'),
	jade        = require('gulp-jade'),
	browserSync = require('browser-sync').create(),
  	gutil       = require('gulp-util'),
  	ftp         = require('vinyl-ftp'),
	browserify  = require('gulp-browserify'),
	uglify      = require('gulp-uglify'),
	rename      = require('gulp-rename'),
	plumber     = require('gulp-plumber'),
	concat      = require('gulp-concat'),
  	size        = require('gulp-size');




// ██████╗  █████╗ ████████╗██╗  ██╗███████╗
// ██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██╔════╝
// ██████╔╝███████║   ██║   ███████║███████╗
// ██╔═══╝ ██╔══██║   ██║   ██╔══██║╚════██║
// ██║     ██║  ██║   ██║   ██║  ██║███████║
// ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

var
	paths = {
		jade : {
			location    : '- dev/markups/**/*.jade',
			compiled    : '- dev/markups/_pages/*.jade',
			destination : 'dist/'
		},

		scss : {
			location    : '- dev/styles/**/*.scss',
			entryPoint  : 'dist/css/main.css'
		},

		compass : {
			configFile  : 'config.rb',
			cssFolder   : 'dist/css',
			scssFolder  : '- dev/styles',
			imgFolder   : 'dist/img'
		},

		js : {
			location    : '- dev/scripts/main.js',
			plugins     : '- dev/scripts/_plugins/*.js',
			destination : 'dist/js'
		},

		browserSync : {
			baseDir : 'dist/',
			watchPaths : ['dist/*.html', 'dist/css/*.css', 'dist/js/*.js']
		}
	}



// ████████╗ █████╗ ███████╗██╗  ██╗███████╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//    ██║   ███████║███████╗█████╔╝ ███████╗
//    ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
//    ██║   ██║  ██║███████║██║  ██╗███████║
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝

/* --------- BROWSER SYNC - sync --------- */

gulp.task('sync', function() {
  browserSync.init({
    server: {
      baseDir: paths.browserSync.baseDir
    }
  });
});

/* --------- RELOAD WATCHING - watch --------- */

gulp.task('watch', function(){
  gulp.watch(paths.jade.location, ['jade']);
  gulp.watch(paths.scss.location, ['compass']);
  gulp.watch(paths.js.location, ['scripts']);
  gulp.watch(paths.js.plugins, ['plugins']);
  gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/* --------- JADE - jade --------- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/* --------- SCSS-COMPASS - compass --------- */

gulp.task('compass', function() {
	gulp.src(paths.scss.location)
		.pipe(plumber())
		.pipe(compass({
			config_file: paths.compass.configFile,
			css: paths.compass.cssFolder,
			sass: paths.compass.scssFolder,
			image: paths.compass.imgFolder
		}));
});


/* --------- PLUGINS - plugins, sctipts --------- */

gulp.task('plugins', function() {
	return gulp.src(paths.js.plugins)
		.pipe(plumber())
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.destination));
});

gulp.task('scripts', function() {
	return gulp.src(paths.js.location)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(paths.js.destination));
});

/* --------- SIZE - size --------- */

gulp.task('size', function () {
    return gulp.src('dist/**/*').pipe(size({title: 'DIST size: '}));
});

/* --------- DEPLOY - deploy --------- */

gulp.task('deploy', function() {
    var conn = ftp.create({
        host: "",
        user: "",
        password: "",
        parallel: 10,
        log: gutil.log
    });

    return gulp.src(['./dist/**/*'], { base: './dist/', buffer: false})
            .pipe(conn.dest('/public_html'));
});



// ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗
// ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝
// ██████╔╝██║   ██║██║██║     ██║  ██║███████╗
// ██╔══██╗██║   ██║██║██║     ██║  ██║╚════██║
// ██████╔╝╚██████╔╝██║███████╗██████╔╝███████║
// ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝

/* --------- DEFAULT - gulp --------- */

gulp.task('default', ['jade', 'plugins', 'scripts', 'compass', 'sync', 'watch']);

gulp.task('go-away', ['size'], function () {
    gulp.start('deploy');
});
