import type { IPageFunctions } from '../../types'
import inquirer from 'inquirer'

/** 获取登录账号密码 */
interface ILoginInfo {
  username: string;
  password: string;
}
export async function getLoginInfo(): Promise<ILoginInfo> {
  let { username } = await inquirer.prompt({
    name: 'username',
    type: 'input',
    message: '请输入账号：'
  })
  let { password } = await inquirer.prompt({
    name: 'password',
    type: 'password',
    message: '请输入密码：'
  })

  // 处理空数据和前后空格
  username = username ? username.trim() : ''
  password = password ? password.trim() : ''

  return { username, password }
}

/** 获取页面名称 */
export async function getName(): Promise<string> {
  const { name } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: '请输入名称(get${name})：'
  })

  return name ? name.trim() : ''
}

/** 获取页面标题 */
export async function getTitle(): Promise<string> {
  const { title } = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: '请输入标题：'
  })

  return title ? title.trim() : ''
}

/** 获取模型名称 */
export async function getModel(): Promise<string> {
  const { model } = await inquirer.prompt({
    name: 'model',
    type: 'input',
    message: '请输入模型：'
  })

  return model ? model.trim() : ''
}

/** 获取模型接口名称 */
export async function getModelInterface(): Promise<string> {
  const { modelInterface } = await inquirer.prompt({
    name: 'modelInterface',
    type: 'input',
    message: '请输入模型接口名称：'
  })

  return modelInterface ? modelInterface.trim() : ''
}

/** 获取权限名称 */
export async function getRule(): Promise<string> {
  const { rule } = await inquirer.prompt({
    name: 'rule',
    type: 'input',
    message: '请输入权限：'
  })

  return rule ? rule.trim() : ''
}

/** 获取功能 */
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
