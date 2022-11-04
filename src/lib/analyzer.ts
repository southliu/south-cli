import puppeteer from 'puppeteer'

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
      headless: true, // 无头模式
      args: ['--no-sandbox']
    })

    return browser
  }

  /** 获取数据 */
  async getData() {
    const browser = await this.initBrowser()
    console.log('browser:', browser)
    
    await browser.close()
  }
}

export default Analyzer