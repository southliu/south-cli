import type { ILanguage, IPageFunctions } from '../types'
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