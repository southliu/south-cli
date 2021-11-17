import path from 'path'
import { ILanguage } from "../types";

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
  const prefix = language === 'vue' ? '.vue' : '.tsx'
  // 文件名称
  const fileName = `${name}${prefix}`
  // 文件所在路径
  const filePath = path.join(cwd, fileName)
  
  return filePath
}

// 首字母大写
export function firstToUpper(str: string) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + $2.toLowerCase();
  })
}