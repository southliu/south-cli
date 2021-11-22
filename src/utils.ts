import loading from 'loading-cli'
import inquirer from 'inquirer';
import path from 'path'
import { ILanguage, IPageFunctions } from "../types";

// 添加 ANSI 转义字符，以将文本输出为红色
export function errorColor(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为绿色
export function successColor(str: string) {
  return `\x1b[32m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为蓝色
export function cyanColor(str: string) {
  return `\x1b[36m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为暗淡
export function dimColor(str: string) {
  return `\x1b[2m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为斜体
export function italicFont(str: string) {
  return `\x1b[3m${str}\x1b[0m`;
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
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + $2;
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
    }
  })
  return result
}

// 加载动画
export async function handleLoading(fn: Promise<any>, text: string = '加载中...') {
  const load = loading({
    text,
    color: 'cyan',
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  })
  load.start()

  try {
    // 执行方法
    const result = await fn;
    // 状态成功
    load.stop()
    return result; 
  } catch (error) {
    // 状态失败
    load.stop()
    console.log(`${errorColor('执行失败,请重试')}`)
    return false
  }
}

// 询问页面标题
export async function handleTitle() {
  // 获取标题
  const { title } = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: '请输入标题：'
  })

  return title
}

// 页面所需功能
export async function handleFunctions() {
  // 询问基础功能
  const { functions }: { functions: IPageFunctions[] } = await inquirer.prompt({
    name: 'functions',
    type: 'checkbox',
    message: '选择页面功能:',
    choices: [
      { name: '搜索', value: 'search', checked: true },
      { name: '分页', value: 'pagination', checked: true },
      { name: '新增', value: 'create', checked: true },
      { name: '删除', value: 'delete', checked: true },
      { name: '批量删除', value: 'batch-delete' }
    ]
  })

  // 新增类型 create: 弹窗 create-page: 跳转页面
  if (functions.includes('create')) {
    // 询问新增类型
    const { type } = await inquirer.prompt({
      name: 'type',
      type: 'confirm',
      message: '新增是否以弹窗形式展现? Y: 弹窗 n: 跳转'
    })

    // 处理基础功能中的新增类型
    const createIdx = functions.indexOf('create')
    functions[createIdx] = type ? 'create' : 'create-page'
  }

  return functions
}

// 功能划分
interface IFilterFuncResult {
  isSearch: boolean;
  isCreate: boolean;
  isPagination: boolean;
  isDelete: boolean;
  isBatchDelete: boolean;
}
export function filterFuncs(functions: IPageFunctions[]): IFilterFuncResult {
  let isSearch = functions.includes('search'),
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