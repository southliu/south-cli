import AnalyzerCreate from './analyzerCreate'
import AnalyzerTable from './analyzerTable'

/**
 * 获取表格数据
 * @param url - 链接
 */
export async function analyzerTable(url: string) {
  const name = 'analyzer-table'
  const table = new AnalyzerTable(url, name)
  await table.handleCreate()
}

/**
 * 获取新增数据
 * @param url - 链接
 */
 export async function analyzerCreate(url: string) {
  const name = 'analyzer-create'
  const create = new AnalyzerCreate(url, name)
  await create.handleCreate()
}