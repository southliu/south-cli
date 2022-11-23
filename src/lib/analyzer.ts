import puppeteer from 'puppeteer'
import AnalyzerLogin from './analyzerLogin'

/**
 * 根据链接获取界面数据
 */
class Analyzer {
  private static instance: Analyzer // 为外部使用变量

  /** 为外部使用内部方法  */
  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }

    return Analyzer.instance
  }

  /** 初始化界面 */
  private async initBrowser() {
    try {
      const browser = await puppeteer.launch({
        headless: false, // 是否开启无头模式
        args: ['--no-sandbox']
      })
  
      return browser
    } catch(err) {
      console.log('无法初始化界面:', err)
      return false
    }
  }

  /** 初始化页面 */
  private async initPage(url: string, browser: puppeteer.Browser) {
    try {
      const page = await browser.newPage()
      await page.goto(url)
      return page
    } catch(err) {
      console.log('无法初始化页面:', err)
      return false
    }
  }

  /**
   * 处理点击事件
   * @param path - 元素路径
   * @param page - 页面
   */
  private async clickElement(path: string, page: puppeteer.Page) {
    await page.waitForSelector(path, { timeout: 5000 })
    await page.click(path)
  }

  /**
   * 获取列表数据
   * @param page - 页面数据
   */
  private async getListData(page: puppeteer.Page) {
    try {
      // 等待并点击data加号展开树形表格
      const dataCollapsed = 'div.caseContainer > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await this.clickElement(dataCollapsed, page)

      // 等待并点击items加号展开树形表格
      const itemsCollapsed = 'div.caseContainer > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(1) > span.ant-table-row-expand-icon.ant-table-row-collapsed'
      await this.clickElement(itemsCollapsed, page)

      // 获取页面行数据
      const label = 'div.caseContainer > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr'
      await page.waitForSelector(label, { timeout: 5000 })
      
      return await page.$$eval(label, labels => {
        const result: { title: string, dataIndex: string, width: number }[] = []

        labels.map(item => {
          const title = (item.querySelector('.table-desc') as HTMLElement)?.innerText || ''
          const dataIndex = (item.querySelector('.ant-table-row > td') as HTMLElement)?.innerText || ''

          if (title && dataIndex) result.push({ title, dataIndex, width: 200 })
        })

        return result
      })
    } catch(err) {
      console.log('获取列表数据失败', err)
      return ''
    }
  }

  /**
   * 获取数据
   * @param url - 链接
   */
  async getData(url: string) {
    try {
      // 创建窗口和页面
      const browser = await this.initBrowser()
      if (!browser) return

      const page = await this.initPage(url, browser)
      if (!page) return

      // 处理登录
      await new AnalyzerLogin().handleLogin(page, url)

      // 获取页面数据
      const listData = await this.getListData(page)
      console.log('listData:', listData)

      await browser.close()
    } catch(err) {
      console.log('获取页面数据失败：', err)
    }
  }
}

export default Analyzer