import inquirer from 'inquirer'
import fs from 'fs-extra'
import { cyanColor, errorColor, getFilePath, handleFunctions, handleTitle } from '../src/utils';
import { ILanguage, IPageFunctions } from '../types'
import { handleFile } from '../templates/React';

class GeneratorPage {
  name: string; // 文件名
  language: ILanguage;
  isSuccess: boolean;
  constructor(name: string, language: ILanguage) {
    this.name = name
    this.language = language
    this.isSuccess = false
  }

  // 模型名称
  async handleModelName() {
    // 获取模型名称
    const { modelName } = await inquirer.prompt({
      name: 'modelName',
      type: 'input',
      message: '请输入模型名称：'
    })

    return modelName
  }

  // 下载模板
  hanleDownload(title: string, modelName: string, functions: IPageFunctions[]) {
    // 文件路径
    const filePath = getFilePath(this.name, this.language)
    // 文件内容
    const content = handleFile(title, modelName, functions)

    // 判断是否存在当前文件
    if (fs.pathExistsSync(filePath)) {
      this.isSuccess = false
      return console.log(errorColor('  文件已存在'))
    }

    this.isSuccess = true
    // 生成文件
    fs.outputFileSync(filePath, content)
  }

  // 创建处理
  async handleCreate() {
    // 获取标题
    const title = await handleTitle()

    // 模型名称
    const modelName = await this.handleModelName()

    // 页面功能
    const functions = await handleFunctions()

    // 执行下载
    this.hanleDownload(title, modelName.trim(), functions)

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanColor(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage