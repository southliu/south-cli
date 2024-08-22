import type { IPageFunctions } from '../../types'
import { input, checkbox, confirm, password as psdInput } from '@inquirer/prompts'

/** 获取登录账号密码 */
interface ILoginInfo {
  username: string;
  password: string;
}

export async function getLoginInfo(): Promise<ILoginInfo> {
  let username = await input({
    message: '请输入账号：'
  })
  let password = await psdInput({
    message: '请输入密码：'
  })

  // 处理空数据和前后空格
  username = username ? username.trim() : ''
  password = password ? password.trim() : ''

  return { username, password }
}

/** 获取页面名称 */
export async function getName(): Promise<string> {
  const name = await input({
    message: '请输入名称(get${name})：'
  })

  return name ? name.trim() : ''
}

/** 获取页面标题 */
export async function getTitle(): Promise<string> {
  const title = await input({
    message: '请输入标题：'
  })

  return title ? title.trim() : ''
}

/** 获取模型名称 */
export async function getModel(): Promise<string> {
  const model = await input({
    message: '请输入模型：'
  })

  return model ? model.trim() : ''
}

/** 获取模型接口名称 */
export async function getModelInterface(): Promise<string> {
  const modelInterface = await input({
    message: '请输入模型接口名称：'
  })

  return modelInterface ? modelInterface.trim() : ''
}

/** 获取权限名称 */
export async function getRule(): Promise<string> {
  const rule = await input({
    message: '请输入权限：'
  })

  return rule ? rule.trim() : ''
}

/** 获取功能 */
export async function getFunctions() {
  // 询问基础功能
  const functions: IPageFunctions[] = await checkbox({
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

  // 新增类型 create: 弹窗 createPage: 跳转页面
  if (functions.includes('create')) {
    // 询问新增类型
    const type = await confirm({
      message: '新增是否以弹窗形式展现? Y: 弹窗 n: 跳转'
    })

    // 处理基础功能中的新增类型
    if (!type) functions.push('createPage')
  }

  return functions
}
