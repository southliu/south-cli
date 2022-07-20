import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import { getFunctions, getRule } from '../utils/common'
import { errorText } from '../utils/utils'
import type { IPageFunctions } from '../types'

/**
 * 生成Vue页面
 * 1. 输入页面权限名称
 * 2. 选择页面功能：增删改查
 * 3. 生成模板页面
 */
class GeneratorVue {
  name: string // 文件名
  constructor(name: string) {
    this.name = name
  }

  /**
   * 获取模板
   */
  getTemplate(rule: string, funcs: IPageFunctions[]): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/index.ejs")
    )
    
    const code = ejs.render(templateCode.toString(), {
      rule,
      funcs
    })

    return code
  }

  /**
   * 获取数据模板
   */
  getDateTemplate(rule: string, funcs: IPageFunctions[]): string {
    const templateCode = fs.readFileSync(
      path.resolve(__dirname, "../../templates/Vue/data.ejs")
    )
    
    const code = ejs.render(templateCode.toString(), {
      rule,
      funcs
    })

    return code
  }

  /**
   * 生成模板
   * @param code - 模板代码
   * @param data - 数据代码
   */
  generatorTemplate(code: string, data: string) {
    // 获取当前命令行选择文件
    const cwd = process.cwd()

    // 输出模板代码
    const codeFilePath = path.join(cwd, `${this.name}.vue`)
    fs.outputFileSync(codeFilePath, code)

    // 输出数据代码
    const dataFilePath = path.join(cwd, `${this.name}.ts`)
    fs.outputFileSync(dataFilePath, data)
  }

  /**
   * 创建页面
   */
  async handleCreate() {
    // 1. 获取权限
    const rule = await getRule()
    if (!rule) return console.log(errorText('  请输入有效权限'))

    // 2. 选择页面功能：增删改查
    const funcs: IPageFunctions[] = await getFunctions()
    if (funcs?.length === 0) return console.log(errorText('  请选择有效功能'))

    // 3. 生成模板页面
    const code = this.getTemplate(rule, funcs)
    const data = this.getDateTemplate(rule, funcs)
    if (!code || !data) return console.log(errorText('  错误模板数据'))
    this.generatorTemplate(code, data)
  }
}

export default GeneratorVue