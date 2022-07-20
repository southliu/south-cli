import inquirer from 'inquirer'
import fs from 'fs-extra'
import { cyanText, errorText, firstToUpper, getFilePath } from '../utils/utils'
import { getTitle, getFunctions } from '../utils/common'
import { ILanguage, IPageFunctions } from '../types'
import { handleFile } from '../../templates/React'
import { handleModelFile } from '../../templates/React/model'
import { handleServerFile } from '../../templates/React/server'

class GeneratorPage {
  name: string // 文件名
  language: ILanguage
  isSuccess: boolean
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

  // 权限路径
  async handleAuthPath() {
    // 获取模型名称
    const { authPath } = await inquirer.prompt({
      name: 'authPath',
      type: 'input',
      message: '请输入权限名称：'
    })

    return authPath
    
  }

  // 下载模板
  handleDownload(title: string, modelName: string, authPath: string, functions: IPageFunctions[]) {
    // 文件名称
    let fileName = this.name
    if (this.name.includes('-')) {
      const arr = fileName.trim().split('-')
      let result = ``
      arr.forEach((item, index) => {
        result += index === 0 ? item : firstToUpper(item)
      })
      fileName = result
    }
    // 文件路径
    const filePath = getFilePath(this.name, this.language)
    // 文件内容
    const content = handleFile(title, modelName, authPath, functions)

    // 模型文件路径
    const modelFilePath = getFilePath(`${fileName}.model`, 'ts')
    // 模型内容
    const modelContent = handleModelFile(modelName, functions)

    // api文件路径
    const apiFilePath = getFilePath(`${fileName}.api`, 'ts')
    // 模型内容
    const apiContent = handleServerFile(authPath, functions)

    // 判断是否存在当前文件
    if (fs.pathExistsSync(filePath)) {
      this.isSuccess = false
      return console.log(errorText('  文件已存在'))
    }

    // 判断是否存在模型文件
    if (fs.pathExistsSync(modelFilePath)) {
      this.isSuccess = false
      return console.log(errorText('  模型文件已存在'))
    }

    // 判断是否存在API文件
    if (fs.pathExistsSync(apiFilePath)) {
      this.isSuccess = false
      return console.log(errorText('  API文件已存在'))
    }

    this.isSuccess = true
    // 生成文件
    fs.outputFileSync(filePath, content)
    fs.outputFileSync(modelFilePath, modelContent)
    fs.outputFileSync(apiFilePath, apiContent)
  }

  // 创建处理
  async handleCreate() {
    // 获取标题
    const title = await getTitle()

    // 模型名称
    const modelName = await this.handleModelName()

    // 权限路径
    const authPath = await this.handleAuthPath()
    
    // 页面功能
    const functions = await getFunctions()

    // 执行下载
    this.handleDownload(title, modelName.trim(), authPath, functions)

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanText(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage