import { clickElement } from './utils/helper'
import { errorText, successText } from '../../utils/helper'
import path from 'path'
import fs from 'fs-extra'
import puppeteer from 'puppeteer'
import AnalyzerInit from './analyzerInit'

interface ICreate {
  label: string;
  name: string;
  component: string;
}

class AnalyzerCreate {
  private url: string // 链接
  private name: string // 文件名
  constructor(url: string, name: string) {
    this.url = url
    this.name = name
  }

  /**
   * 展开树形表格
   * @param page - 页面数据
   */
   private async tableCollapsed(page: puppeteer.Page) {
    try {
      // 等待并点击data加号展开树形表格
      const dataCollapsed = 'span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await clickElement(dataCollapsed, page)
    } catch(err) {
      console.log(errorText('展开树形表格失败'))
    }
  }

  /**
   * 获取新增数据
   * @param page - 页面数据
   */
  private async getCreateData(page: puppeteer.Page) {
    try {
      // 展开树形表格
      await this.tableCollapsed(page)

      // 获取页面行数据
      const label = 'div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr'
      await page.waitForSelector(label, { timeout: 3000 })

      return await page.$$eval(label, labels => {
        const result: ICreate[] = []

        labels.map(item => {
          const name = (item.querySelector('td:first-child') as HTMLElement)?.innerText || ''
          const label = (item.querySelector('.table-desc') as HTMLElement)?.innerText || ''

          if (name && label) result.push({ label, name, component: 'Input' })
        })

        return result
      })
    } catch(err) {
      console.log(errorText('获取Yapi新增数据失败：'), err)
      return []
    }
  }

  /** 获取新增数据 */
  private async getData() {
    try {
      const { page, browser } = await new AnalyzerInit().init(this.url)
      if (!browser || !page) return []

      const result = await this.getCreateData(page)

      await browser.close()
      return result
    } catch(err) {
      console.log(errorText('获取新增数据失败：'), err)
      return []
    }
  }

  /**
   * 处理数据
   * @param data - 数据
   */
  private filterData(data: ICreate[]): string {
    if (data.length === 0) return ''
    let result = ''

    // 处理表格数据
    for (let i = 0; i < data.length; i++) {
      const element = data[i]

      if (i === 0) {
        result += '// 新增数据\n'
        result += 'export const createList: (id: string) => IFormList[] = id => [\n'
      }

      result += '  {\n'
      result += `    label: '${element.label}',\n`
      result += `    name: '${element.name}',\n`
      result += `    component: '${element.component}'\n`
      result += '  },\n'

      if (i === data.length - 1) {
        result += ']\n'
      }
    }

    return result
  }

  /** 创建文件 */
  async handleCreate() {
    try {
      const data = await this.getData()

      // 获取当前命令行选择文件
      const cwd = process.cwd()

      // 输出文件
      const codeFilePath = path.join(cwd, `${this.name}.ts`)
      fs.outputFileSync(codeFilePath, this.filterData(data))
      console.log(successText(`创建${this.name}.ts文件成功`))
    } catch(err) {
      console.log(errorText('创建新增文件失败：'), err)
    }
  }
}

export default AnalyzerCreate