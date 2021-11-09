#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import figlet from 'figlet'
import create from '../lib/create'
import { cyanColor, dimColor, errorColor, italicFont  } from './utils'

const pack = require(path.join(__dirname, '../../package.json'))
const program = new Command(pack.name)

// 配置生成项目指令
program
  .command('create <project-name>')
  .description('创建一个项目')
  .action((name) => {
    // 执行创建方法
    create(name, 'project')
  });

// 配置生成react页面指令
program
  .command('create-react-page <language-name>')
  .description('创建一个项目')
  .action((language) => {
    // 执行创建方法
    create(language, 'page', 'react')
  });

// 配置生成vue页面指令
program
  .command('create-vue-page <language-name>')
  .description('创建一个项目')
  .action((language) => {
    // 执行创建方法
    create(language, 'page', 'vue')
  });

// 处理错误指令
program
  .configureOutput({
    // 将错误高亮显示
    outputError: (str, write) => {
      return write(errorColor(`无效指令,请执行以下操作`))
    }
  })
  .showHelpAfterError(`
    \r\n创建项目操作:
    ${cyanColor('south create ' + italicFont('project-name'))}\r
    \r\n创建页面操作:
    ${cyanColor('south create-react-page ' + italicFont('page-name'))}\r
    ${dimColor('or')}\r
    ${cyanColor('south create-vue-page ' + italicFont('page-name'))}\r\n
    \r\帮助说明:
    ${cyanColor('south --help')}\r
  `)

// 监听help指令
program
  .description('帮助说明')
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('SOUTH-CLI', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 90,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${cyanColor(`south <command> --help`)} show details\r\n`)
  })

// 版本控制
program.version(pack.version)

// 解析用户执行命令传入参数
program.parse(process.argv);
