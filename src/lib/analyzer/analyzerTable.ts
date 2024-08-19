import type { Page } from 'puppeteer'
import { clickElement } from './utils/helper'
import { errorText, successText } from '../../utils/helper'
import path from 'path'
import fs from 'fs-extra'
import AnalyzerInit from './analyzerInit'

interface IQuery {
  label: string,
  name: string,
  component: 'Input'
}

interface ITable {
  title: string,
  dataIndex: string,
  width: number
}

class AnalyzerTable {
  private url: string // 链接
  private name: string // 文件名
  constructor(url: string, name: string) {
    this.url = url
    this.name = name
  }

  /**
   * 获取表格查询数据
   * @param page - 页面数据
   */
  private async getQueryData(page: Page) {
    try {
      // 获取页面行数据
      const label = 'div.colQuery > div > div > div > div > div > div > table > tbody > tr'
      await page.waitForSelector(label, { timeout: 3000 })
      
      return await page.$$eval(label, labels => {
        const result: IQuery[] = []

        labels.map(item => {
          const label = (item.querySelector('td:last-child > p') as HTMLElement)?.innerText || ''
          const name = (item.querySelector('td:first-child') as HTMLElement)?.innerText || ''

          if (name && label) result.push({ label, name, component: 'Input' })
        })

        return result
      })
    } catch(err) {
      console.log(errorText('获取Yapi查询数据失败'), err)
      return []
    }
  }

  /**
   * 展开树形表格
   * @param page - 页面数据
   */
  private async tableCollapsed(page: Page) {
    try {
      // 等待并点击data加号展开树形表格
      const dataCollapsed = 'span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await clickElement(dataCollapsed, page)

      // 等待并点击items加号展开树形表格
      const itemsCollapsed = 'span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await clickElement(itemsCollapsed, page)
    } catch(err) {
      console.log(errorText('展开树形表格失败'))
    }
  }

  /**
   * 获取表格数据
   * @param page - 页面数据
   */
  private async getTableData(page: Page) {
    try {
      // 展开树形表格
      await this.tableCollapsed(page)

      // 获取页面行数据
      const label = 'div.caseContainer > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr'
      await page.waitForSelector(label, { timeout: 3000 })

      return await page.$$eval(label, labels => {
        const result: ITable[] = []

        labels.map(item => {
          const title = (item.querySelector('.table-desc') as HTMLElement)?.innerText || ''
          const dataIndex = (item.querySelector('.ant-table-row > td') as HTMLElement)?.innerText || ''

          if (title && dataIndex) result.push({ title, dataIndex, width: 200 })
        })

        return result
      })
    } catch(err) {
      console.log(errorText('获取Yapi表格数据失败'), err)
      return []
    }
  }

  /** 获取数据 */
  private async getData(): Promise<[IQuery[], ITable[]] | []> {
    try {
      const { page, browser } = await new AnalyzerInit().init(this.url)
      if (!browser || !page) return []

      const queryData = await this.getQueryData(page)
      const tableData = await this.getTableData(page)

      await browser.close()
      return [queryData, tableData]
    } catch(err) {
      console.log(errorText('获取表格数据失败'), err)
      return []
    }
  }

  /**
   * 处理数据
   * @param data - 数据
   */
  private filterData(data: [IQuery[], ITable[]] | []): string {
    if (data.length === 0) return ''
    const [query, table] = data
    let result = ''

    // 处理查询数据
    for (let i = 0; i < query.length; i++) {
      const element = query[i]

      if (i === 0) {
        result += '// 搜索数据\n'
        result += 'export const searchList: IFormList[] = [\n'
      }

      result += '  {\n'
      result += `    label: '${element.label}',\n`
      result += `    name: '${element.name}',\n`
      result += `    component: '${element.component}'\n`
      result += '  },\n'

      if (i === query.length - 1) {
        result += ']\n\n'
      }
    }

    // 处理表格数据
    for (let i = 0; i < table.length; i++) {
      const element = table[i]

      if (i === 0) {
        result += '/**\n'
        result += ' * 表格数据\n'
        result += ' * @param optionRender - 渲染操作函数\n'
        result += ' */\n'
        result += 'export const tableColumns = (optionRender: ITableOptions<object>): ITableColumn => {\n'
        result += '  return [\n'
      }

      result += '    {\n'
      result += `      title: '${element.title}',\n`
      result += `      dataIndex: '${element.dataIndex}',\n`
      result += `      width: '${element.width}'\n`
      result += '    },\n'

      if (i === table.length - 1) {
        result += '  ]\n'
        result += '}'
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

export default AnalyzerTable