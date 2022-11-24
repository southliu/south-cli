import loading from 'loading-cli'
import fs from 'fs-extra'

/**
 * 文件是否存在
 * @param path - 路径
 */
export function hasFile(path: string): boolean {
  return fs.existsSync(path)
}

/**
 * 文件夹是否存在
 * @param path - 路径
 */
export function hasFolder(path: string): boolean {
  return fs.existsSync(path)
}

/**
 * 加载动画
 * @param fn - 加载方法
 * @param text - 加载小时内容
 */
export async function handleLoading<T>(fn: Promise<T>, text = '加载中...') {
  const load = loading({
    text,
    color: 'cyan',
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  })
  load.start()

  try {
    // 执行方法
    const result = await fn
    // 状态成功
    load.stop()
    return result 
  } catch (error) {
    // 状态失败
    load.stop()
    return false
  }
}

/**
 * 添加 ANSI 转义字符，以将文本输出为红色
 * @param str - 文本
 */
 export function errorText(str: string) {
  return `\x1b[31m${str}\x1b[0m`
}

/**
 * 添加 ANSI 转义字符，以将文本输出为绿色
 * @param str - 文本
 */
export function successText(str: string) {
  return `\x1b[32m${str}\x1b[0m`
}

/**
 * 添加 ANSI 转义字符，以将文本输出为蓝色
 * @param str - 文本
 */
export function cyanText(str: string) {
  return `\x1b[36m${str}\x1b[0m`
}

/**
 * 添加 ANSI 转义字符，以将文本输出为暗淡
 * @param str - 文本
 */
export function dimText(str: string) {
  return `\x1b[2m${str}\x1b[0m`
}

/**
 * 添加 ANSI 转义字符，以将文本输出为斜体
 * @param str - 文本
 */
export function italicFont(str: string) {
  return `\x1b[3m${str}\x1b[0m`
}