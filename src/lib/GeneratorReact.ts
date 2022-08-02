import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import { errorText, successText } from '../utils/utils'
import { getFunctions, getModel, getModelInterface, getTitle, getRule } from '../utils/inquirer'
import type { IPageFunctions } from '../../types'

/**
 * 生成React页面
 * 1. 输入页面名称
 * 2. 输入页面权限名称
 * 3. 输入模型名称和模型接口名称
 * 4. 选择页面功能：增删改查
 * 5. 生成模板页面
 */
class GeneratorPage {
  name: string // 文件名
  constructor(name: string) {
    this.name = name
  }

  /**
   * 获取模板
   * @param title - 标题
   * @param rule - 权限
   * @param funcs - 功能数据
   * @param model - 模型名称
   * @param modelInterface - 模型接口名称
   */
  getTemplate(
    title: string,
    rule: string,
    funcs: IPageFunctions[],
    model: string,
    modelInterface: string
  ): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/React/index.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { title, rule, funcs, model, modelInterface }
    )

    return code
  }

  /**
   * 获取模型模板
   * @param model - 模型名称
   * @param modelInterface - 模型接口名称
   * @param funcs - 功能数据
   */
  getModelTemplate(
    model: string,
    modelInterface: string,
    funcs: IPageFunctions[]
  ): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/React/model.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { model, modelInterface, funcs, name: this.name }
    )

    return code
  }

  /**
   * 获取接口模板
   * @param rule - 权限
   * @param funcs - 功能数据
   */
  getApiTemplate(rule: String, funcs: IPageFunctions[]): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/React/server.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { rule, funcs }
    )

    return code
  }

  /**
   * 生成模板
   * @param code - 模板代码
   * @param model - 模型代码
   * @param api - 接口代码
   */
  generatorTemplate(code: string, model: string, api: string) {
    // 获取当前命令行选择文件
    const cwd = process.cwd()

    // 输出模板代码
    const codeFilePath = path.join(cwd, `${this.name}.tsx`)
    fs.outputFileSync(codeFilePath, code)
    console.log(successText(`  创建react文件成功 - ${this.name}.tsx`))

    // 输出模型代码
    const modelFilePath = path.join(cwd, `${this.name}.model.ts`)
    fs.outputFileSync(modelFilePath, model)
    console.log(successText(`  创建模型文件成功 - ${this.name}.model.ts`))

    // 输出接口代码
    const apiFilePath = path.join(cwd, `${this.name}.api.ts`)
    fs.outputFileSync(apiFilePath, api)
    console.log(successText(`  创建接口文件成功 - ${this.name}.api.ts`))
  }
  
  // 创建处理
  async handleCreate() {
    // 1. 输入页面名称
    const title = await getTitle()
    if (!title) return console.log(errorText('  请输入有效标题'))

    // 2. 获取权限
    const rule = await getRule()
    if (!rule) return console.log(errorText('  请输入有效权限'))

    // 3. 输入模型名称和模型接口名称
    const model = await getModel()
    const modelInterface = await getModelInterface()
    if (!model || !modelInterface) return console.log(errorText('  请输入有效模型'))

    // 4. 选择页面功能：增删改查
    const funcs = await getFunctions()

    // 5. 生成模板页面
    const codeTemplate = this.getTemplate(title, rule, funcs, model, modelInterface)
    const modelTemplate = this.getModelTemplate(model, modelInterface, funcs)
    const apiTemplate = this.getApiTemplate(rule, funcs)
    this.generatorTemplate(codeTemplate, modelTemplate, apiTemplate)
  }
}

export default GeneratorPage