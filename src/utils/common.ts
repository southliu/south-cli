import type { IFunctionApi, ILanguage, IPageFunctions } from '../types'
import inquirer from 'inquirer'

/**
 * 获取语言
 */
export async function getLanguage(): Promise<ILanguage> {
  const { language }: { language: ILanguage } = await inquirer.prompt({
    name: 'language',
    type: 'list',
    message: '选择语言:',
    choices: [
      { name: 'React', value: 'react' },
      { name: 'Vue', value: 'vue' }
    ]
  })

  return language
}

/**
 * 获取页面名称
 */
export async function getName(): Promise<string> {
  // 获取名称
  const { name } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: '请输入名称：'
  })

  return name
}

/**
 * 获取页面标题
 */
export async function getTitle(): Promise<string> {
  // 获取标题
  const { title } = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: '请输入标题：'
  })

  return title
}

/**
 * 获取权限名称
 */
export async function getRule(): Promise<string> {
  // 获取标题
  const { rule } = await inquirer.prompt({
    name: 'rule',
    type: 'input',
    message: '请输入权限：'
  })

  return rule
}

/**
 * 获取功能
 */
export async function getFunctions(): Promise<IPageFunctions[]> {
  // 询问基础功能
  const { functions }: { functions: IPageFunctions[] } = await inquirer.prompt({
    name: 'functions',
    type: 'checkbox',
    message: '选择页面功能:',
    choices: [
      { name: '搜索', value: 'search', checked: true },
      { name: '分页', value: 'pagination', checked: true },
      { name: '新增', value: 'create', checked: true },
      { name: '修改', value: 'update', checked: true },
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

/**
 * 根据功能获取API接口
 */
 export async function getApiByFunctions(func: IPageFunctions[]): Promise<IFunctionApi> {
  const res: IFunctionApi = {
    search: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    batchDelete: false,
  }
  
  // 搜索
  const { search } = await inquirer.prompt({
    name: 'search',
    type: 'input',
    message: '请输入搜索接口：'
  })
  res.search = search || 'getPage'

  // 新增
  if (func.includes('create') || func.includes('create-page')) {
    const { create } = await inquirer.prompt({
      name: 'create',
      type: 'input',
      message: '请输入新增接口：'
    })
    res.create = create || 'create'
  }

  // 修改
  if (func.includes('update')) {
    const { detail } = await inquirer.prompt({
      name: 'detail',
      type: 'input',
      message: '请输入根据ID获取详情接口：'
    })
    const { update } = await inquirer.prompt({
      name: 'update',
      type: 'input',
      message: '请输入修改接口：'
    })
    res.detail = detail || 'detail'
    res.update = update || 'update'
  }
  
  // 删除
  if (func.includes('delete')) {
    const { remove } = await inquirer.prompt({
      name: 'remove',
      type: 'input',
      message: '请输入删除接口：'
    })
    res.delete = remove || 'delete'
  }
  
  // 批量删除
  if (func.includes('batch-delete')) {
    const { remove } = await inquirer.prompt({
      name: 'remove',
      type: 'input',
      message: '请输入批量删除接口：'
    })
    res.batchDelete = remove || 'batchDelete'
  }

  return res
}