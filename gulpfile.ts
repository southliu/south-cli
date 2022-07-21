const gulp = require('gulp')

// 将ejs文件拷贝至输出文件中
gulp.task('ejs', () => {
  console.log('拷贝ejs')
  return gulp
          .src('./templates/**/*.ejs') // 读取源文件到流
          .pipe(gulp.dest('bin/templates/')) // 输出目录
})