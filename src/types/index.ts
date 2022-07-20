// 语言类型
export type ILanguage = 'vue' | 'react' | 'node' | 'ts'

// 基础页面功能
export type IPageFunctions = 'search' | // 搜索
                             'pagination' | // 分页
                             'create' | // 新增(弹窗)
                             'create-page' | // 新增(跳转新页面)
                             'delete' | // 删除
                             'batch-delete' // 批量删除
