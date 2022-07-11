import inquirer from 'inquirer'
import { ILanguage } from '../../types'

/**
 * 获取语言
 */
export async function getLanguage(): Promise<ILanguage | undefined> {
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