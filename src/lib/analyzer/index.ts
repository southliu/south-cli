import AnalyzerCreate from './analyzerCreate'
import AnalyzerTable from './analyzerTable'

/**
 * 获取表格数据
 * @param url - 链接
 */
export async function analyzerTable(url: string) {
  const table = new AnalyzerTable(url)
  const [queryData, tableData] = await table.getData()

  return [queryData, tableData]
}


/**
 * 获取新增数据
 * @param url - 链接
 */
 export async function analyzerCreate(url: string) {
  const create = new AnalyzerCreate(url)
  const createData = await create.getData()

  console.log('createData:', createData)

  return createData
}