import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import loading from 'loading-cli'
import path from 'path'
import fs from 'fs-extra'
import { cyanColor, errorColor } from '../src/utils';
import { ILanguage } from '../types'

class GeneratorPage {
  name: string;
  targetDir: string;
  language: ILanguage;
  isSuccess: boolean;
  constructor(name: string, targetDir: string, language: ILanguage) {
    this.name = name
    this.targetDir = targetDir
    this.language = language
    this.isSuccess = true
  }

  // 加载动画
  async handleLoading(fn: Promise<any>, text: string) {
    const load = loading({
      text,
      color: 'cyan',
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    })
    load.start()

    try {
      // 执行方法
      const result = await fn;
      // 状态成功
      load.stop()
      this.isSuccess = true
      return result; 
    } catch (error) {
      // 状态失败
      load.stop()
      this.isSuccess = false
      console.log(`${errorColor('执行失败,请重试')}`)
      return false
    }
  }

  // 页面所需功能
  async handleFunctions() {
    // 询问基础功能
    const { functions }: { functions: string[] } = await inquirer.prompt({
      name: 'functions',
      type: 'checkbox',
      message: '选择页面功能:',
      choices: [
        { name: '搜索', value: 'search', checked: true },
        { name: '分页', value: 'pagination', checked: true },
        { name: '新增', value: 'create', checked: true },
        { name: '删除', value: 'delete', checked: true },
        { name: '批量删除', value: 'batch-delete' }
      ]
    })

    // 新增类型 create: 弹窗 create-page: 跳转页面
    if (functions.includes('create')) {
      // 询问新增类型
      const { type } = await inquirer.prompt({
        name: 'type',
        type: 'confirm',
        message: '新增是否以弹窗形式展现? Y: 弹窗 n: 跳转'
      })

      // 处理基础功能中的新增类型
      const createIdx = functions.indexOf('create')
      functions[createIdx] = type ? 'create' : 'create-page'
    }

    return functions
  }

  // 下载模板
  hanleDownload() {
    // 模版文件目录
    const destUrl = path.join(__dirname, '../templates/React'); 
    // 生成文件目录
    // process.cwd() 对应控制台所在目录
    const cwdUrl = process.cwd();

    fs.readFile(destUrl).then(res => {
      console.log('res:', res)
    })
  }

  // 创建处理
  async handleCreate() {
    // 页面功能
    const functions = await this.handleFunctions()

    console.log('functions:', functions)

    this.hanleDownload()

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanColor(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage