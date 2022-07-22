// 基础页面功能
export type IPageFunctions = 'search' | // 搜索
                             'pagination' | // 分页
                             'create' | // 新增(弹窗)
                             'create-page' | // 新增(跳转新页面)
                             'update' | // 修改
                             'delete' | // 删除
                             'batch-delete' // 批量删除

// API
type IApi = false | string;

// 基础页面API
export type IFunctionApi = {
  search: IApi;
  detail: IApi;
  create: IApi;
  update: IApi;
  delete: IApi;
  batchDelete: IApi;
}