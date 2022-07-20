import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import { errorText, getFilePath, hasFolder } from '../utils/utils'
import { ILanguage } from '../types'
import GeneratorProject from './GeneratorProject'
import GeneratorReact from './GeneratorReact'
import GeneratorVue from './GeneratorVue'
import GeneratorNode from './GeneratorNode'

type IType = 'project' | 'page'

/**
 * 生成项目
 * @param name - 项目名称
 */
export async function createProject(name: string) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件所在路径
  const filePath = path.join(cwd, name)

  // 如果文件夹存在则退出
  if (hasFolder(filePath)) {
    return console.error(errorText('  文件已存在'))
  }

  // 执行创建指令
  const generator = new GeneratorProject(name, filePath)
  generator.handleCreate()
}

// 获取语言
async function getLanguage(type: IType): Promise<ILanguage | undefined> {
  let result: ILanguage | undefined = undefined

  // 页面类型
  if (type === 'page') {
    // 获取语言
    const { language }: { language: ILanguage } = await inquirer.prompt({
      name: 'language',
      type: 'list',
      message: '选择语言:',
      choices: [
        { name: 'React', value: 'react' },
        // { name: 'Vue', value: 'vue' },
        // { name: 'Node', value: 'node' },
      ]
    })
    result = language
  }

  return result
}

// 判断文件是否存在
async function hasFile(type: IType, name: string, language?: ILanguage) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 获取当前文件夹路径
  const targetPath = path.join(cwd, name)
  // 获取当前文件
  const targetFile = getFilePath(name, language)
  // 获取当前文件
  const target = type === 'project' ? targetPath : targetFile
  
  return { 
    isFile: fs.existsSync(target),
    targetPath
  }
}

// 创建指令
async function Create(name: string, type: IType): Promise<void> {
  // 当前语言，类型为页面的时候使用
  const language = await getLanguage(type)
  // 文件是否存在
  const { isFile, targetPath } = await hasFile(type, name, language)

  // 当文件存在则退出
  if (isFile) {
    return console.log(errorText('  文件已存在'))
  }

  // 根据类型执行对应创建指令： project(项目) page(页面)
  switch (type) {
    case 'page': {
      // 执行创建指令
      switch (language) {
        case 'react':
          new GeneratorReact(name, language).handleCreate()
          break

        case 'vue':
          new GeneratorVue(name, language).handleCreate()
          break

        case 'node':
          new GeneratorNode(name, language).handleCreate()
          break

        default:
          console.log(errorText('  无法执行'))
          break
      }
      break
    }

    default: {
      // 执行创建指令
      const generator = new GeneratorProject(name, targetPath)
      generator.handleCreate()
      break
    }
  }
}

export default Create