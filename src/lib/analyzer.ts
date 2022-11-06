import { getLoginInfo } from '../utils/inquirer'
import { hasFile } from '../utils/helper'
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs-extra'

const passwordFilePath = path.join(__dirname, './password_file.ts')

interface IPasswordFileResult {
  username: string;
  password: string;
}

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
   * 判断是否有登录/注册按钮
   * @param label - 标签
   * @param page - 页面数据
   */
  private async hasPasswrod(label: string, page: puppeteer.Page) {
    try {
      await page.waitForSelector(label, { timeout: 5000 })
      const info = await page.$$eval(label, labels => labels.map(item => item.innerHTML))
  
      return info.includes('登录 / 注册')
    } catch(err) {
      console.log('已登录')
      return false
    }
  }

  /**
   * 保存密码文件
   * @param con - 文件内容
   */
  private savePasswordFile(con: string) {
    // 保存密码文件不存在则创建
    if (!hasFile(passwordFilePath)) fs.createFileSync(passwordFilePath)
    // 保存文件数据
    fs.writeFileSync(passwordFilePath, con)
  }

  /**
   * 获取数组中数据
   * @param str - 数组
   */
  private getStrData(str: string) {
    const usernameStr = str.substring(0, 9),
          usernameArr = usernameStr.split(';'),
          username = usernameArr?.[0] || '',
          passwordStr = usernameStr.substring(0, 9),
          passwordArr = passwordStr.split(';'),
          password = passwordArr?.[0] || ''

    return { username, password }
  }

  /** 读取文件数据 */
  private getPasswordFile(): IPasswordFileResult {
    if (!hasFile(passwordFilePath)) {
      return { username: '', password: '' }
    }
    const code = fs.readFileSync(passwordFilePath).toString()
    const { username, password } = this.getStrData(code)
    console.log('{ username, password }:', { username, password })

    return { username, password }
  }

  /** 删除密码文件 */
  private removePasswordFile() {
    // 保存密码文件存在则删除
    if (hasFile(passwordFilePath)) fs.removeSync(passwordFilePath)
  }

  /**
   * 输入账号/密码
   * @param username - 账号
   * @param password - 密码
   * @param page - 页面数据
   */
  private async inputPassword(
    username: string,
    password: string,
    page: puppeteer.Page
  ) {
    try {
      const code = this.getPasswordFile()
      console.log('code:', code)
      // 删除密码文件
      this.removePasswordFile()

      // 输入账号和密码，并登录
      const usernameLabel = '#email', passwordLabel = '#password'
      await page.waitForSelector(usernameLabel, { timeout: 5000 })
      await page.type(usernameLabel, username)
      await page.waitForSelector(passwordLabel, { timeout: 5000 })
      await page.type(passwordLabel, password)
      await page.click('button[type="submit"]')

      // 判断页面成功并保存密码文件
      const con = `username:${username};\npassword:${password};\n`
      this.savePasswordFile(con)
    } catch(err) {
      console.log('输入账号密码失败')
    }
  }

  /**
   * 处理登录
   * @param page - 页面数据
   */
  private async handleLogin(page: puppeteer.Page) {
    const label = '.btn-group > a > .ant-btn > span'
    const isPassword = await this.hasPasswrod(label, page)

    // 需要输入登录
    if (isPassword) {
      await page.click(label) // 点击登录跳转登录页
      const { username, password } = await getLoginInfo()
      await this.inputPassword(username, password, page)
      console.log(username, password)
    }
  }
  
  /**
   * 获取标题
   * @param page - 页面数据
   */
  private async getTitle(page: puppeteer.Page) {
    try {
      const label = '.ntes_nav_wrap > .ntes-nav > .ntes-nav-main > .c-fl > a'
      await page.waitForSelector(label, { timeout: 5000 })
      const title = await page.$$eval(label, labels => labels.map(item => item.innerHTML))
      return title
    } catch(err) {
      console.log('获取标题失败')
      return ''
    }
  }

  /**
   * 获取数据
   * @param url - 链接
   */
  async getData(url: string) {
    try {
      const browser = await this.initBrowser()
      const page = await this.initPage(url, browser)
      await this.handleLogin(page)
      const title = await this.getTitle(page)
      console.log('title:', title)
  
      await browser.close()
      // setTimeout(async () => {
      //   await browser.close()
      // }, 5000)
    } catch(err) {
      console.log('获取页面数据失败：', err)
    }
  }
}

export default Analyzer