import loading from 'loading-cli'
import fs from 'fs-extra'
import path from 'path'

/**
 * 首字母大写
 * @param word - 单词
 */
export function firstUpperCase(word: string) {
  // 如果不是字符串则返回
  if (typeof word !== 'string') return word
  const first = word.substring(0, 1).toUpperCase()
  return `${first}${word.substring(1, word.length)}`
}

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
 * 获取API文件路径
 * @param name - API文件名
 */
export function getApiPath(name = 'servers'): string {
  const lastArr: string[] = [], text = /^[A-Z]:\\$/
  let max = 0, // 最大层级，大于10则退出循环
      cwd = process.cwd() // 获取当前命令行选择文件

  while (max < 10) {
    // 分割最后一个路径，并记录该路径
    const cwdPaths = cwd.split('\\'), last = cwdPaths.pop()
    if (last && last !== 'pages' && last !== 'viwes') lastArr.push(last)

    cwd = path.resolve(cwd, '..') // 父级路径
    const apiPath = `${cwd}\\${name}`, // API路径
          has = hasFolder(apiPath) // 是否存在API文件

    // 存在该文件则退出
    if (has) {
      const lastPath = lastArr.join('\\')
      return `${apiPath}\\${lastPath}`
    }

    // 如果当前文件是硬盘空间则退出
    if (text.test(cwd)) return ''
    max++
  }

  return ''
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
 * 获取API名称
 * @param rule - 路由
 */
export function getApiName(rule: string): string {
  // 返回路由中最后一个单词
  const arr = rule.split('/')
  return arr[arr.length - 1]
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