import { errorText } from '../../utils/helper'
import { getLoginInfo } from '../../utils/inquirer'
import { getLocalInfo, removeLocalInfo, setLocalInfo } from '../../utils/local'
import puppeteer from 'puppeteer'

const USERNAME = 'username'
const PASSWORD = 'password'

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
   * @param page - 页面数据
   */
   private async hasPasswrod(page: puppeteer.Page) {
    try {
      const label = 'div > div.btn-group > a > button'
      await page.waitForSelector(label, { timeout: 3000 })
      await page.click(label) // 点击登录跳转登录页
      return true
    } catch(err) {
      return false
    }
  }

  /** 读取文件数据 */
  private getUsernamePassword(): IPasswordFileResult {
    const username = getLocalInfo(USERNAME) || '',
          password = getLocalInfo(PASSWORD) || ''

    return { username, password }
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
      await page.waitForSelector(usernameLabel, { timeout: 3000 })
      await page.waitForSelector(passwordLabel, { timeout: 3000 })

      // 输入账号和密码数据
      await page.type(usernameLabel, username)
      await page.type(passwordLabel, password)

      // 等待页面跳转
      await Promise.all([
        page.waitForNavigation({ timeout : 1000 }),
        page.click('button[type="submit"]')
      ])

      // 登录成功并保存密码缓存
      setLocalInfo(USERNAME, username)
      setLocalInfo(PASSWORD, password)

      // 跳转缓存页面
      await page.goto(url)
    } catch(err) {
      console.log(errorText('账号或密码错误，请重新输入!'))

      // 删除用户密码缓存
      removeLocalInfo(USERNAME)
      removeLocalInfo(PASSWORD)

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
      const isPassword = await this.hasPasswrod(page)
  
      // 需要输入登录
      if (isPassword) {  
        // 从密码缓存文件中获取
        let code = this.getUsernamePassword()
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
