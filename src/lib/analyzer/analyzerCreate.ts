import puppeteer from 'puppeteer'
import { clickElement } from './utils/helper'
import { errorText } from '../../utils/helper'
import AnalyzerInit from './analyzerInit'

interface ICreate {
  label: string;
  name: string;
  component: string;
}

class AnalyzerCreate {
  private url: string // 链接
  constructor(url: string) {
    this.url = url
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
  async getData() {
    try {
      const { page, browser } = await new AnalyzerInit().init(this.url)
      if (!browser || !page) return console.log('初始化失败')

      const result = await this.getCreateData(page)

      await browser.close()
      return result
    } catch(err) {
      console.log(errorText('获取新增数据失败：'), err)
      return []
    }
  }
}

export default AnalyzerCreate