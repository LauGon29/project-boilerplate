import gulp from 'gulp';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

const browserSync = require('browser-sync').create();

const input = './src/scss/main.scss';
const output = './dist/css';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

const autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('serve', ['sass', 'script'], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['script']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('sass', () => {
    gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output))
        .pipe(browserSync.stream());
});

gulp.task('script', () => {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('watch', () => {
  gulp
    .watch(input, ['sass'])
    .on('change', event => {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('default', ['serve']);

gulp.task('prod', () => {
  gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output));
});
