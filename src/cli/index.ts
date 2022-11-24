#! /usr/bin/env node
import { Command } from 'commander'
import { cyanText, errorText, italicFont } from '../utils/helper'
import {
  createProject,
  createVue,
  createReact
} from '../lib/create'
import path from 'path'
import figlet from 'figlet'
import { analyzerTable, analyzerCreate } from '../lib/analyzer'

const pack = require(path.join(__dirname, '../../../package.json'))
const program = new Command(pack.name)

// 获取Yapi表格数据
program
  .command('analyzer-table <url>')
  .description('获取Yapi表格数据')
  .action((url) => {
    // 执行创建方法
    analyzerTable(url)
  })

// 获取Yapi新增数据
program
  .command('analyzer-create <url>')
  .description('获取Yapi新增数据')
  .action((url) => {
    // 执行创建方法
    analyzerCreate(url)
  })

// 配置生成项目指令
program
  .command('create <project-name>')
  .description('创建一个项目')
  .action((name) => {
    // 执行创建方法
    createProject(name)
  })

// 配置生成Vue页面指令
program
  .command('create-vue <page-name>')
  .description('创建一个Vue页面')
  .action((name) => {
    // 执行创建方法
    createVue(name)
  })

// 配置生成React页面指令
program
  .command('create-react <page-name>')
  .description('创建一个React页面')
  .action((name) => {
    // 执行创建方法
    createReact(name)
  })

// 处理错误指令
program
  .configureOutput({
    // 将错误高亮显示
    outputError: (str, write) => {
      return write(`${errorText(`无效指令,请执行以下操作`)}
        \r\n创建项目操作:
        ${cyanText('south create ' + italicFont('project-name'))}\r
        \r\n创建Vue页面操作:
        ${cyanText('south create-vue ' + italicFont('vue-name'))}\r\n
        \r\n创建React页面操作:
        ${cyanText('south create-react ' + italicFont('react-name'))}\r\n
        \r\n帮助说明:
        ${cyanText('south --help')}\r
      `)
    }
  })

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
