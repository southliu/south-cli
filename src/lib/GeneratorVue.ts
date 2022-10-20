import type { IPageFunctions } from '../../types'
import { getFunctions, getName, getRule } from '../utils/inquirer'
import { errorText, getApiName, getApiPath, hasFolder, successText } from '../utils/helper'
import { ICreatePage } from '../../types/lib/create'
import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'

/**
 * 生成Vue页面
 * 1.判断是否有同名文件夹
 * 2.输入页面名称，需要与keepalive一致
 * 3.输入页面权限名称
 * 4.选择页面功能：增删改查
 * 5.生成模板页面
 */
class GeneratorVue extends ICreatePage {
  name: string // 文件名
  constructor(name: string) {
    super()
    this.name = name
  }

  /**
   * 获取模板接口文件路径
   * @param apiName - 接口名称
   */
  getTemplateApiPath(apiName: string): string {
    // 获取接口文件路径
    const apiPath = getApiPath().lastPath
    const result = apiPath ? `@/servers/${apiPath}/${apiName}` : `./${apiName}`
    return result
  }

  /**
   * 获取模板
   * @param name - 页面唯一名称，需要与keepalive一致
   * @param rule - 权限
   * @param apiName - 接口名称
   * @param funcs - 功能数据
   */
  getTemplate(
    name: string,
    rule: string,
    apiName: string,
    funcs: IPageFunctions[],
  ): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/index.ejs")
    )
    // 获取接口文件路径
    const apiPath = this.getTemplateApiPath(apiName)
    const code = ejs.render(
      templateCode.toString(),
      { name, rule, apiPath, funcs }
    )

    return code
  }

  /**
   * 获取数据模板
   * @param funcs - 功能数据
   */
  getDateTemplate(funcs: IPageFunctions[]): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/data.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { funcs }
    )

    return code
  }

  /**
   * 获取接口模板
   * @param rule - 权限
   * @param name - 名称
   * @param funcs - 功能数据
   */
  getApiTemplate(
    rule: string,
    name: string,
    funcs: IPageFunctions[]
  ): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/server.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { rule, name, funcs }
    )

    return code
  }

  /**
   * 获取接口文件路径
   * @param apiName - 接口名称
   */
  getApiFilePath(apiName: string): string {
    // 获取当前命令行选择文件
    const cwd = process.cwd()
    // 获取接口文件路径
    const apiPath = getApiPath().fullPath
    let result = apiPath ? `${apiPath}\\${apiName}.ts` : ''
    // 如果接口文件为空则为当前文件下创建
    if (!result) result = path.join(cwd, `${this.name}\\${apiName}.ts`)
    return result
  }

  /**
   * 生成模板
   * @param code - 模板代码
   * @param data - 数据代码
   * @param api - 接口代码
   * @param apiName - 接口名称
   * @param filePath - 文件夹路径
   */
  generatorTemplate(
    code: string,
    data: string,
    api: string,
    apiName: string,
    filePath: string
  ) {
    // 获取当前命令行选择文件
    const cwd = process.cwd()
    // 创建文件夹
    fs.mkdirsSync(filePath)

    // 输出模板代码
    const codeFilePath = path.join(cwd, `${this.name}\\index.vue`)
    fs.outputFileSync(codeFilePath, code)
    console.log(successText(`  创建vue文件成功 - ${codeFilePath}`))

    // 输出数据代码
    const dataFilePath = path.join(cwd, `${this.name}\\data.ts`)
    fs.outputFileSync(dataFilePath, data)
    console.log(successText(`  创建data文件成功 - ${dataFilePath}`))

    // 输出接口代码
    const apiFilePath = this.getApiFilePath(apiName)
    fs.outputFileSync(apiFilePath, api)
    console.log(successText(`  创建接口文件成功 - ${apiFilePath}`))
  }

  /** 创建页面 */
  async handleCreate() {
    // 获取当前命令行选择文件
    const cwd = process.cwd()
    // 文件夹所在路径
    const filePath = path.join(cwd, this.name)

    // 1.判断是否有同名文件夹
    if (hasFolder(filePath)) {
      // 如果文件夹存在则退出
      return console.error(errorText(`  ${this.name}文件夹已存在`))
    }

    // 2.输入页面名称，需要与keepalive一致
    const name = await getName()
    if (!name) return console.log(errorText('  请输入有效名称'))

    // 3.获取权限
    const rule = await getRule()
    if (!rule) return console.log(errorText('  请输入有效权限'))
    // 获取api文件名称
    const apiName = getApiName(rule)

    // 4.选择页面功能：增删改查
    const funcs = await getFunctions()

    // 5.生成模板页面
    const codeTemplate = this.getTemplate(name, rule, apiName, funcs)
    const dataTemplate = this.getDateTemplate(funcs)
    const apiTemplate = this.getApiTemplate(rule, name, funcs)
    if (!codeTemplate || !dataTemplate || !apiTemplate) {
      return console.log(errorText('  错误模板数据'))
    }
    this.generatorTemplate(codeTemplate, dataTemplate, apiTemplate, apiName, filePath)
  }
}

export default GeneratorVue