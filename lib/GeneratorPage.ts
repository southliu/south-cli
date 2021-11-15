import inquirer from 'inquirer'
import loading from 'loading-cli'
import fs from 'fs-extra'
import { cyanColor, errorColor, getFilePath } from '../src/utils';
import { ILanguage, IPageFunctions } from '../types'
import { handleReactFile } from '../templates/React';
import { handleVueFile } from '../templates/Vue';

class GeneratorPage {
  name: string; // 文件名
  language: ILanguage;
  isSuccess: boolean;
  constructor(name: string, language: ILanguage) {
    this.name = name
    this.language = language
    this.isSuccess = false
    console.log('this.language:', this.language)
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
    const { functions }: { functions: IPageFunctions[] } = await inquirer.prompt({
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
  hanleDownload(functions: IPageFunctions[]) {
    // 文件路径
    const filePath = getFilePath(this.name, this.language)
    // 文件内容
    const content = this.language === 'react' ? handleReactFile(functions) : handleVueFile(functions)

    // 判断是否存在当前文件
    if (fs.pathExistsSync(filePath)) {
      this.isSuccess = false
      return console.log(errorColor('文件已存在'))
    }

    this.isSuccess = true
    // 生成文件
    fs.outputFileSync(filePath, content)
  }

  // 创建处理
  async handleCreate() {
    // 页面功能
    const functions = await this.handleFunctions()

    this.hanleDownload(functions)

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanColor(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage