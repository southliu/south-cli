import puppeteer from 'puppeteer'

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
    const browser = await puppeteer.launch({
      headless: false, // 是否开启无头模式
      args: ['--no-sandbox']
    })

    return browser
  }

  /** 初始化页面 */
  private async initPage(url: string, browser: puppeteer.Browser) {
    const page = await browser.newPage()
    await page.goto(url)
    return page
  }

  /**
   * 获取标题
   * @param page - 页面数据
   */
  private async getTitle(page: puppeteer.Page) {
    const label = '.ntes_nav_wrap > .ntes-nav > .ntes-nav-main > .c-fl > a'
    await page.waitForSelector(label, { timeout: 5000 })
    const title = await page.$$eval(label, labels => labels.map(item => item.innerHTML))
    return title
  }

  /**
   * 获取数据
   * @param url - 链接
   */
  async getData(url: string) {
    const browser = await this.initBrowser()
    const page = await this.initPage(url, browser)
    const title = await this.getTitle(page)
    console.log('title:', title)

    await browser.close()
    // setTimeout(async () => {
    //   await browser.close()
    // }, 5000)
  }
}

export default Analyzer