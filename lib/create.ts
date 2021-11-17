import fs from 'fs-extra'
import path from 'path'
import { errorColor, getFilePath } from '../src/utils'
import { ILanguage } from '../types'
import Generator from './Generator'
import GeneratorPage from './GeneratorPage'

type IType = 'project' | 'page' | 'page'

async function Create(name: string, type: IType, language?: ILanguage) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 获取当前文件夹路径
  const targetPath = path.join(cwd, name)
  // 获取当前文件
  const targetFile = getFilePath(name, language)
  // 获取当前文件
  const target = type === 'project' ? targetPath : targetFile

  // 判断是否存在当前文件
  // if (fs.existsSync(target)) {
  //   return console.log(errorColor('文件已存在'))
  // }

  // 根据类型执行对应创建指令： project(项目) page(页面)
  switch (type) {
    case 'page': {
      // 执行创建指令
      const generator = new GeneratorPage(name, language as ILanguage)
      generator.handleCreate()
      break
    }

    default: {
      // 执行创建指令
      const generator = new Generator(name, targetPath)
      generator.handleCreate()
      break
    }
  }
}

export default Create