#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import chalk from 'chalk'
import figlet from 'figlet'
import create from '../lib/create'

const pack = require(path.join(__dirname, '../../package.json'))
const program = new Command(pack.name)

// 配置生成项目指令
program
  .command('create <project-name>')
  .description('创建一个项目')
  .action((name) => {
    // 执行创建方法
    create(name)
  });

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
    console.log(`\r\nRun ${chalk.cyan(`south <command> --help`)} show details\r\n`)
  })


// 版本控制
program.version('0.0.1')

// 解析用户执行命令传入参数
program.parse(process.argv);
