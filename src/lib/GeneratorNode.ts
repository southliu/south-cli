import fs from 'fs-extra'
import { cyanColor, errorColor, getFilePath, handleFunctions, handleTitle } from '../utils/utils'
import { ILanguage, IPageFunctions } from '../types'
import { handleFile } from '../../templates/Node'

class GeneratorPage {
  name: string // 文件名
  language: ILanguage
  isSuccess: boolean
  constructor(name: string, language: ILanguage) {
    this.name = name
    this.language = language
    this.isSuccess = false
  }

  // 下载模板
  handleDownload(title: string, functions: IPageFunctions[]) {
    // 文件路径
    const filePath = getFilePath(this.name, this.language)
    // 文件内容
    const content = handleFile(functions)

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

    // 页面功能
    const functions = await handleFunctions()

    // 执行下载
    this.handleDownload(title, functions)

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanColor(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage