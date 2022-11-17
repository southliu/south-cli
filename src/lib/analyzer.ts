import { getLoginInfo } from '../utils/inquirer'
import { hasFile } from '../utils/helper'
import { decryption, encryption } from '../utils/crypto'
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs-extra'

// 加密分割标识符
const passwordSymbol = '($$)'
// 加密文件路径
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
  private url = '' // 链接

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
   * 获取字符串中数据
   * @param str - 字符串
   */
  private getStrData(str: string) {
    const data = decryption(str)
    if (!data && !data.includes(passwordSymbol)) {
      return { username: '', password: '' }
    }

    const arr = data.split(passwordSymbol),
          username = arr?.[0] || '',
          password = arr?.[1] || ''

    return { username, password }
  }

  /** 读取文件数据 */
  private getPasswordFile(): IPasswordFileResult {
    if (!hasFile(passwordFilePath)) {
      return { username: '', password: '' }
    }
    const code = fs.readFileSync(passwordFilePath)
    const { username, password } = this.getStrData(code?.toString())

    return { username, password }
  }

  /** 删除密码文件 */
  private removePasswordFile() {
    // 保存密码文件存在则删除
    if (hasFile(passwordFilePath)) fs.removeSync(passwordFilePath)
  }

  /**
   * 清空输入框数据
   * @param elem - 元素
   * @param page - 页面数据
   */
  private async clearInput(elem: string, page: puppeteer.Page) {
    try {
      // ctrl + a -> Backspace
      await page.focus(elem)
      await page.keyboard.down('Control')
      await page.keyboard.press('KeyA')
      await page.keyboard.up('Control')
      await page.keyboard.press('Backspace')
    } catch(err) {
      console.log('清空输入框数据失败', err)
    }
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
      // 输入账号和密码，并登录
      const usernameLabel = '#email', passwordLabel = '#password'
      // 等待账号和密码元素出现
      await page.waitForSelector(usernameLabel, { timeout: 5000 })
      await page.waitForSelector(passwordLabel, { timeout: 5000 })

      // 输入账号和密码数据
      await page.type(usernameLabel, username)
      await page.type(passwordLabel, password)

      // 等待页面跳转
      await Promise.all([
        page.waitForNavigation({ timeout : 1000 }),
        page.click('button[type="submit"]')
      ])

      // 登录成功并保存密码文件
      const con = encryption(`${username}${passwordSymbol}${password}`)
      this.savePasswordFile(con)

      // 跳转缓存页面
      await page.goto(this.url)
    } catch(err) {
      console.log('账号或密码错误，请重新输入', err)

      // 删除密码文件
      this.removePasswordFile()

      // 清除账号和密码原本值
      const usernameLabel = '#email', passwordLabel = '#password'
      await this.clearInput(usernameLabel, page)
      await this.clearInput(passwordLabel, page)

      // 重新输入
      const { username, password } = await getLoginInfo()
      await this.inputPassword(username, password, page)
    }
  }

  /**
   * 处理登录
   * @param page - 页面数据
   */
  private async handleLogin(page: puppeteer.Page) {
    try {
      const label = '.btn-group > a > .ant-btn > span'
      const isPassword = await this.hasPasswrod(label, page)
  
      // 需要输入登录
      if (isPassword) {
        await page.click(label) // 点击登录跳转登录页
  
        // 从密码缓存文件中获取
        let code = this.getPasswordFile()
        // 如果密码缓存文件不存在则手动输入
        if (!code.username && !code.password) {
          code = await getLoginInfo()
        }
        
        const { username, password } = code
        await this.inputPassword(username, password, page)
      }
    } catch(err) {
      console.log('登录失败', err)
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
      // 缓存url链接
      if (url) this.url = url

      // 创建窗口和页面
      const browser = await this.initBrowser()
      if (!browser) return

      const page = await this.initPage(url, browser)
      if (!page) return

      // 处理登录
      await this.handleLogin(page)
      const title = await this.getTitle(page)
      console.log('title:', title)

      await browser.close()
    } catch(err) {
      console.log('获取页面数据失败：', err)
    }
  }
}

export default Analyzer