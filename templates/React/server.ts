import type { IPageFunctions } from "../../src/types"
import { filterFuncs } from "../../src/utils/utils"

// 生成react文件
export function handleServerFile(authPath: string, functions: IPageFunctions[]): string {
  // 功能拆分
  const {
    isCreate,
    isDelete,
    isBatchDelete
  } = filterFuncs(functions)

  // 渲染数据
  const render = `
import request from '@/utils/request'
${
  isCreate ? `
/**
 * 新增
 * @param {Object} data
 */
function create(data: any) {
  return request.post(\`${authPath}\`, data)
}

/**
 * 修改
 * @param {String} id  主键ID
 * @param {Object} data
 */
function update(id: string, data: any) {
  return request.patch(\`${authPath}/\${id}\`, data)
}` : ''
}${
  isDelete ? `\n
/**
 * 删除
 * @param {String} id
 */
function del(id: string) {
  return request.delete(\`${authPath}/\${id}\`)
}` : ''
}${
  isBatchDelete ? `\n
/**
 * 批量删除
 * @param {String} ids
 */
function batch_del(ids: string) {
  return request.delete(\`${authPath}/batch-delete?ids=\${ids}\`)
}
  ` : ''
}
/**
 * 查询-根据主键查询
 * @param {String} id
 */
function find_one(id: string) {
  return request.get(\`${authPath}/\${id}\`)
}

/**
 * 查询-根据条件分页查询
 * @param {Object} data
 */
function find_page(data: any) {
  return request.get(\`${authPath}\`, { params: data })
}

/**
 * 查询-根据条件分页查询
 * @param {Object} data
 */
function find_tree(data: any) {
  return request.get(\`${authPath}/tree\`, { params: data })
}

export default {${
  isCreate ? `
  create,
  update,` : ''
}${
  isDelete ? `
  del,` : ''
}${
  isBatchDelete ? `
  batch_del,` : ''
}
  find_one,
  find_page,
  find_tree
}
`

  return render
}