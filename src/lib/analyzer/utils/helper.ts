import type { Page } from 'puppeteer'
import { errorText } from '../../../utils/helper'

/**
 * 处理点击事件
 * @param path - 元素路径
 * @param page - 页面
 */
export async function clickElement(path: string, page: Page) {
  try {
    await page.waitForSelector(path, { timeout: 3000 })
    await page.click(path)
  } catch(err) {
    console.log(errorText(`处理点击事件失败(${path}):`), err)
  }
}