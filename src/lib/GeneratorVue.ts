import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import { getApiByFunctions, getFunctions, getName, getRule } from '../utils/inquirer'
import { errorText, successText } from '../utils/utils'
import type { IFunctionApi, IPageFunctions } from '../types'

/**
 * 生成Vue页面
 * 1. 输入页面名称，需要与keepalive一致
 * 2. 输入页面权限名称
 * 3. 选择页面功能：增删改查
 * 4. 获取接口名称
 * 5. 生成模板页面
 */
class GeneratorVue {
  name: string // 文件名
  constructor(name: string) {
    this.name = name
  }

  /**
   * 获取模板
   * @param name - 页面唯一名称，需要与keepalive一致
   * @param rule - 权限
   * @param funcs - 功能数据
   * @param api - 接口数据
   */
  getTemplate(name: string, rule: string, funcs: IPageFunctions[], api: IFunctionApi): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/index.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { name, rule, funcs, api }
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
    const code = ejs.render(templateCode.toString(), { funcs })

    return code
  }

  /**
   * 获取接口模板
   * @param rule - 权限
   * @param api - 接口数据
   */
  getApiTemplate(rule: string, api: IFunctionApi): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/server.ejs")
    )
    const code = ejs.render(templateCode.toString(), { rule, api })

    return code
  }

  /**
   * 生成模板
   * @param name - 名称
   * @param code - 模板代码
   * @param data - 数据代码
   * @param api - 接口代码
   */
  generatorTemplate(name: string, code: string, data: string, api: string) {
    // 获取当前命令行选择文件
    const cwd = process.cwd()

    // 输出模板代码
    const codeFilePath = path.join(cwd, `${this.name}.vue`)
    fs.outputFileSync(codeFilePath, code)
    console.log(successText(`  创建vue文件成功 - ${this.name}.vue`))

    // 输出数据代码
    const dataFilePath = path.join(cwd, `${this.name}.ts`)
    fs.outputFileSync(dataFilePath, data)
    console.log(successText(`  创建data文件成功 - ${this.name}.ts`))

    // 输出接口代码
    const apiFilePath = path.join(cwd, `${name}.ts`)
    fs.outputFileSync(apiFilePath, api)
    console.log(successText(`  创建接口文件成功 - ${name}.ts`))
  }

  /**
   * 创建页面
   */
  async handleCreate() {
    // 1. 输入页面名称，需要与keepalive一致
    const name = await getName()
    if (!name) return console.log(errorText('  请输入有效名称'))

    // 2. 获取权限
    const rule = await getRule()
    if (!rule) return console.log(errorText('  请输入有效权限'))

    // 3. 选择页面功能：增删改查
    const funcs = await getFunctions()

    // 4. 获取接口名称
    const api = await getApiByFunctions(funcs)

    // 5. 生成模板页面
    const codeTemplate = this.getTemplate(name, rule, funcs, api)
    const dataTemplate = this.getDateTemplate(funcs)
    const apiTemplate = this.getApiTemplate(rule, api)
    if (!codeTemplate || !dataTemplate || !apiTemplate) return console.log(errorText('  错误模板数据'))
    this.generatorTemplate(name, codeTemplate, dataTemplate, apiTemplate)
  }
}

export default GeneratorVue