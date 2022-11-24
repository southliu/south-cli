import puppeteer from 'puppeteer'
import { clickElement } from './utils/helper'
import { errorText } from '../../utils/helper'
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
  constructor(url: string) {
    this.url = url
  }

  /**
   * 获取表格查询数据
   * @param page - 页面数据
   */
  private async getQueryData(page: puppeteer.Page) {
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
   * 展开树形菜单
   * @param page - 页面数据
   */
  private async tableCollapsed(page: puppeteer.Page) {
    try {
      // 等待并点击data加号展开树形表格
      const dataCollapsed = 'span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await clickElement(dataCollapsed, page)

      // 等待并点击items加号展开树形表格
      const itemsCollapsed = 'span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await clickElement(itemsCollapsed, page)
    } catch(err) {
      console.log(errorText('展开树形菜单失败'))
    }
  }

  /**
   * 获取表格数据
   * @param page - 页面数据
   */
  private async getTableData(page: puppeteer.Page) {
    try {
      // 展开树形菜单
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
  async getData(): Promise<[IQuery[], ITable[]] | []> {
    try {
      const { page, browser } = await new AnalyzerInit().init(this.url)
      if (!browser || !page) return []

      const queryData = await this.getQueryData(page)
      console.log('queryData:', queryData)
      const tableData = await this.getTableData(page)
      console.log('tableData:', tableData)

      await browser.close()
      return [queryData, tableData]
    } catch(err) {
      console.log(errorText('获取表格数据失败'), err)
      return []
    }
  }
}

export default AnalyzerTable