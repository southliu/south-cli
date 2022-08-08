import type { IPageFunctions } from '../../types'
import inquirer from 'inquirer'

/**
 * 获取页面名称
 */
export async function getName(): Promise<string> {
  // 获取名称
  const { name } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: '请输入名称(首字母大写)：'
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
 * 获取模型名称
 */
export async function getModel(): Promise<string> {
  // 获取模型
  const { model } = await inquirer.prompt({
    name: 'model',
    type: 'input',
    message: '请输入模型：'
  })

  return model
}

/**
 * 获取模型接口名称
 */
export async function getModelInterface(): Promise<string> {
  // 获取模型
  const { modelInterface } = await inquirer.prompt({
    name: 'modelInterface',
    type: 'input',
    message: '请输入模型接口名称：'
  })

  return modelInterface
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
      { name: '批量删除', value: 'batchDelete' }
    ]
  })

  return functions
}
