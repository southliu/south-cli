import { getLoginInfo } from '../utils/inquirer'
import { hasFile } from '../utils/helper'
import { decryption, encryption } from '../utils/crypto'
import puppeteer from 'puppeteer'
import fs from 'fs-extra'
import path from 'path'

// 加密分割标识符
const passwordSymbol = '($$)'
// 加密文件路径
const passwordFilePath = path.join(__dirname, './password_file.ts')

interface IPasswordFileResult {
  username: string;
  password: string;
}

interface IInputPasswordProps {
  username: string,
  password: string,
  page: puppeteer.Page,
  url: string
}

class AnalyzerLogin {
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
    if (!data && typeof data !== 'string' && !data?.includes(passwordSymbol)) {
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
   * @param props - 传参
   */
  private async inputPassword(props: IInputPasswordProps) {
    const {
      username,
      password,
      page,
      url
    } = props

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
      await page.goto(url)
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
      await this.inputPassword({ username, password, page, url })
    }
  }

  /**
   * 处理登录
   * @param page - 页面数据
   */
  async handleLogin(page: puppeteer.Page, url: string) {
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
        
        await this.inputPassword({ ...code, page, url })
      }
    } catch(err) {
      console.log('登录失败', err)
    }
  }
}

export default AnalyzerLogin
