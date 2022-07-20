#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import figlet from 'figlet'
import create, { createProject } from '../lib/create'
import { cyanText, errorText, italicFont } from '../utils/utils'

const pack = require(path.join(__dirname, '../../../package.json'))
const program = new Command(pack.name)

// 配置生成项目指令
program
  .command('create <project-name>')
  .description('创建一个项目')
  .action((name) => {
    // 执行创建方法
    createProject(name)
  })

// 配置生成页面指令
program
  .command('create-page <language-name>')
  .description('创建一个React页面')
  .action((language) => {
    // 执行创建方法
    create(language, 'page')
  })

// 处理错误指令
program
  .configureOutput({
    // 将错误高亮显示
    outputError: (str, write) => {
      return write(errorText(`无效指令,请执行以下操作`))
    }
  })
  .showHelpAfterError(`
    \r\n创建项目操作:
    ${cyanText('south create ' + italicFont('project-name'))}\r
    \r\n创建页面操作:
    ${cyanText('south create-page ' + italicFont('page-name'))}\r\n
    \r\n帮助说明:
    ${cyanText('south --help')}\r
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
    }))
    // 新增说明信息
    console.log(`\r\nRun ${cyanText(`south <command> --help`)} show details\r\n`)
  })

// 版本控制
program.version(pack.version)

// 解析用户执行命令传入参数
program.parse(process.argv)
