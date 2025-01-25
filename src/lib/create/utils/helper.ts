import { hasFolder } from '../../../utils/helper'
import path from 'path'

/**
 * 获取API文件路径
 * @param name - API文件名
 */
 interface IGetApiPathResult {
  lastPath: string; // 最后窃取路径，转化为@/servers/lastPath
  fullPath: string; // 完整的API路径
}
export function getApiPath(name = 'servers'): IGetApiPathResult {
  const lastArr: string[] = [], text = /^[A-Z]:\/$/
  let max = 0, // 最大层级，大于10则退出循环
      cwd = process.cwd() // 获取当前命令行选择文件

  while (max < 10) {
    // 分割最后一个路径，并记录该路径
    const cwdPaths = cwd.split('\/'), last = cwdPaths.pop()
    if (last && last !== 'pages' && last !== 'views') lastArr.push(last)

    cwd = path.resolve(cwd, '..') // 父级路径
    const apiPath = `${cwd}\/${name}`, // API路径
          has = hasFolder(apiPath) // 是否存在API文件

    // 存在该文件则退出
    if (has) {
      const lastPath = lastArr.join('\/')
      return {
        lastPath: lastArr.join('/'),
        fullPath: `${apiPath}\/${lastPath}`
      }
    }

    // 如果当前文件是硬盘空间则退出
    if (text.test(cwd)) return { lastPath: '', fullPath: '' }
    max++
  }

  return { lastPath: '', fullPath: '' }
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