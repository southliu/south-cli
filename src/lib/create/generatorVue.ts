import type { IPageFunctions } from '../../../types'
import { getFunctions, getName, getRule, getTitle } from '../../utils/inquirer'
import { getApiName, getApiPath } from './utils/helper'
import { errorText, firstUpperCase, hasFolder, successText } from '../../utils/helper'
import { ICreatePage } from '../../../types/lib/create'
import path from 'path'
import fs from 'fs-extra'
import ejs from 'ejs'

// 模板参数
interface ITemplate {
  name: string;
  title: string;
  rule: string;
  apiName: string;
  funcs: IPageFunctions[];
}

// 接口参数
interface IApiTemplate {
  rule: string;
  name: string;
  funcs: IPageFunctions[];
}

// 新增跳转操作参数
interface IOptionTemplate {
  rule: string;
  name: string;
  apiName: string;
  funcs: IPageFunctions[];
}

// 生成代码参数
interface IGenerator {
  code: string;
  data: string;
  api: string;
  apiName: string;
  filePath: string;
}

/**
 * 生成Vue页面
 * 1.判断是否有同名文件夹
 * 2.输入页面标题
 * 3.输入页面名称，需要与keepalive一致
 * 4.输入页面权限名称
 * 5.选择页面功能：增删改查
 * 6.生成模板页面
 */
class GeneratorVue extends ICreatePage<
  ITemplate,
  IApiTemplate,
  IOptionTemplate,
  IGenerator
> {
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
   * @param props - 参数
   */
  getTemplate(props: ITemplate): string {
    const { title, rule, apiName, funcs } = props
    let { name } = props
    name = firstUpperCase(name) // 首字母大写
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../../templates/Vue/index.ejs")
    )
    // 获取接口文件路径
    const apiPath = this.getTemplateApiPath(apiName)
    const code = ejs.render(
      templateCode.toString(),
      { name, title, rule, apiPath, funcs }
    )

    return code
  }

  /**
   * 获取数据模板
   * @param funcs - 功能数据
   */
  getDateTemplate(funcs: IPageFunctions[]): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../../templates/Vue/model.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { funcs }
    )

    return code
  }

  /**
   * 获取接口模板
   * @param props - 参数
   */
  getApiTemplate(props: IApiTemplate): string {
    const { rule, funcs } = props
    let { name } = props
    name = firstUpperCase(name) // 首字母大写
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../../templates/Vue/server.ejs")
    )
    const code = ejs.render(
      templateCode.toString(),
      { rule, name, funcs }
    )

    return code
  }

  /**
   * 获取新增跳转页面模板
   */
  getOptionTemplate(props: IOptionTemplate): string {
    const { rule, apiName, funcs } = props
    if (!funcs.includes('create-page')) return ''

    let { name } = props
    name = firstUpperCase(name) // 首字母大写

    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../../templates/Vue/option.ejs")
    )
    // 获取接口文件路径
    const apiPath = this.getTemplateApiPath(apiName)
    const code = ejs.render(
      templateCode.toString(),
      { rule, name, apiPath, funcs }
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
   * @param props - 参数
   */
  generatorTemplate(props: IGenerator) {
    const {
      code,
      data,
      api,
      apiName,
      filePath
    } = props

    // 获取当前命令行选择文件
    const cwd = process.cwd()
    // 创建文件夹
    fs.mkdirsSync(filePath)

    // 输出模板代码
    const codeFilePath = path.join(cwd, `${this.name}\\index.vue`)
    fs.outputFileSync(codeFilePath, code)
    console.log(successText(`  创建vue文件成功 - ${codeFilePath}`))

    // 输出数据代码
    const dataFilePath = path.join(cwd, `${this.name}\\model.ts`)
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

    // 2.输入页面标题
    const title = await getTitle()
    if (!title) return console.log(errorText('  请输入有效标题'))

    // 3.输入页面名称，需要与keepalive一致
    const name = await getName()
    if (!name) return console.log(errorText('  请输入有效名称'))

    // 4.获取权限
    const rule = await getRule()
    if (!rule) return console.log(errorText('  请输入有效权限'))
    // 获取api文件名称
    const apiName = getApiName(rule)

    // 5.选择页面功能：增删改查
    const funcs = await getFunctions()

    // 6.生成模板页面
    const codeTemplate = this.getTemplate({name, title, rule, apiName, funcs})
    const dataTemplate = this.getDateTemplate(funcs)
    const apiTemplate = this.getApiTemplate({rule, name, funcs})
    if (!codeTemplate || !dataTemplate || !apiTemplate) {
      return console.log(errorText('  错误模板数据'))
    }

    // 执行生成模板
    const params = {
      code: codeTemplate,
      data: dataTemplate,
      api: apiTemplate,
      apiName,
      filePath
    }
    this.generatorTemplate(params)
  }
}

export default GeneratorVue