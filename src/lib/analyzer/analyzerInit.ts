import { errorText } from '../../utils/helper'
import { launch, type Browser } from 'puppeteer'
import AnalyzerLogin from './analyzerLogin'

class analyzerInit {
  /** 初始化界面 */
  private async initBrowser() {
    try {
      const browser = await launch({
        headless: false, // 是否开启无头模式
        userDataDir: './cacheData' // 将浏览器数据保存在指定路径下
      })
  
      return browser
    } catch(err) {
      console.log(errorText('无法初始化界面:'), err)
      return false
    }
  }

  /** 初始化页面 */
  private async initPage(url: string, browser: Browser) {
    try {
      const page = await browser.newPage()
      await page.goto(url)
      return page
    } catch(err) {
      console.log(errorText('无法初始化页面:'), err)
      return false
    }
  }


  /**
   * 初始化
   */
  async init(url: string) {
    try {
      // 创建窗口和页面
      const browser = await this.initBrowser()
      if (!browser) return {}

      const page = await this.initPage(url, browser)
      if (!page) return {}

      // 处理登录
      await new AnalyzerLogin().handleLogin(page, url)

      return { browser, page }
    } catch(err) {
      console.log(errorText('初始化失败：'), err)
      return {}
    }
  }
}

export default analyzerInit