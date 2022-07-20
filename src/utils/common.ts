import inquirer from 'inquirer'
import { ILanguage } from '../types'

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
 * 获取名称
 */
export async function getName(): Promise<string> {
  const { name }: { name: string } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: '请输入名称:'
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