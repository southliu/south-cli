import type { ILanguage, IPageFunctions } from "../types"
import loading from 'loading-cli'
import path from 'path'
import fs from 'fs-extra'

/**
 * 文件是否存在
 * @param path - 路径
 */
export function hasFile2(path: string): boolean {
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

// 获取文件路径
export function getFilePath(name: string, language?: ILanguage) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件后缀
  let prefix = ''
  switch (language) {
    case 'vue':
      prefix = '.vue'
      break

    case 'react':
      prefix = '.tsx'
      break

    default:
      prefix = '.ts'
      break
  }
  // 文件名称
  const fileName = `${name}${prefix}`
  // 文件所在路径
  const filePath = path.join(cwd, fileName)
  
  return filePath
}

// 首字母大写
export function firstToUpper(str: string) {
  return str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => {
    return $1.toUpperCase() + $2
  })
}

// 获取处理后的权限路径
type IAuthPathResult = 'modal' | 'api'
export function handleAuthPath(str: string, type: IAuthPathResult) {
  let result = ``
  
  // 拆分路径
  const authArr = str.trim().substring(1, str.length).split('/')

  authArr.forEach((item, index) => {
    if (!item) return

    switch (type) {
      // 模型名称
      case 'modal': {
        if (item.includes('-')) {
          const arr = item.trim().split('-')
          arr.forEach(child => result += firstToUpper(child))
        } else {
          result += firstToUpper(item)
        }
        break
      }

      // API路径
      case 'api': {
        if (item.includes('-')) {
          const arr = item.trim().split('-')
          arr.forEach(child => result += index === 1 ? `${child}/` : firstToUpper(child))
        } else {
          result += index === 1 ? `${item}/` : firstToUpper(item)
        }
        break
      }

      default:
        break
    }
  })
  return result
}

// 功能划分
interface IFilterFuncResult {
  isSearch: boolean
  isCreate: boolean
  isPagination: boolean
  isDelete: boolean
  isBatchDelete: boolean
}
export function filterFuncs(functions: IPageFunctions[]): IFilterFuncResult {
  const isSearch = functions.includes('search'),
      isCreate = functions.includes('create') || functions.includes('create-page'),
      isPagination = functions.includes('pagination'),
      isDelete = functions.includes('delete'),
      isBatchDelete = functions.includes('batch-delete')

  return {
    isSearch,
    isCreate,
    isPagination,
    isDelete,
    isBatchDelete
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