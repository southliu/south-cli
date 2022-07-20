import fs from 'fs-extra'
import { cyanText, errorText, getFilePath, handleFunctions } from '../utils/utils'
import { getTitle } from '../utils/common'
import { ILanguage, IPageFunctions } from '../types'
import { handleFile } from '../../templates/Vue'

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
    const content = handleFile(title, functions)

    // 判断是否存在当前文件
    if (fs.pathExistsSync(filePath)) {
      this.isSuccess = false
      return console.log(errorText('  文件已存在'))
    }

    this.isSuccess = true
    // 生成文件
    fs.outputFileSync(filePath, content)
  }

  // 创建处理
  async handleCreate() {
    // 获取标题
    const title = await getTitle()

    // 页面功能
    const functions = await handleFunctions()

    // 执行下载
    this.handleDownload(title, functions)

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanText(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage