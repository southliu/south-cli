import { errorText, hasFile } from '../../utils/helper'
import path from 'path'
import AnalyzerCreate from './analyzerCreate'
import AnalyzerTable from './analyzerTable'

/**
 * 获取表格数据
 * @param url - 链接
 */
export async function analyzerTable(url: string) {
  const name = 'tableAnalyzer'
  
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件所在路径
  const filePath = path.join(cwd, `${name}.ts`)

  // 如果文件存在则退出
  if (hasFile(filePath)) {
    return console.error(errorText(`  ${name}.ts已存在`))
  }

  const table = new AnalyzerTable(url, name)
  await table.handleCreate()
}


/**
 * 获取新增数据
 * @param url - 链接
 */
 export async function analyzerCreate(url: string) {
  const name = 'createAnalyzer'
  
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件所在路径
  const filePath = path.join(cwd, `${name}.ts`)

  // 如果文件存在则退出
  if (hasFile(filePath)) {
    return console.error(errorText(`  ${name}.ts已存在`))
  }

  const create = new AnalyzerCreate(url, name)
  await create.handleCreate()
}