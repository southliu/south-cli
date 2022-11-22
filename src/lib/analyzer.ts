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
   * 获取标题
   * @param page - 页面数据
   */
  private async getTitle(page: puppeteer.Page) {
    try {
      const label = 'table:nth-child(2)'
      await page.waitForSelector(label, { timeout: 5000 })
      const title = await page.$$eval(label, labels => labels.map(item => item.innerHTML))
      return title
    } catch(err) {
      console.log('获取标题失败', err)
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
      const title = await this.getTitle(page)
      console.log('title:', title)

      await browser.close()
    } catch(err) {
      console.log('获取页面数据失败：', err)
    }
  }
}

export default Analyzer