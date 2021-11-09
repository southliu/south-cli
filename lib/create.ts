import fs from 'fs-extra'
import path from 'path'
import { errorColor } from '../src/utils'
import Generator from './Generator'
import GeneratorPage from './GeneratorPage'

type IType = 'project' | 'page' | 'page'
type ILanguage = 'vue' | 'react'

async function Create(name: string, type: IType, language?: ILanguage) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  const targetPath = path.join(cwd, name)

  // 判断是否存在当前文件
  if (fs.existsSync(targetPath)) {
    return console.log(errorColor('文件已存在'))
  }

  // 根据类型执行对应创建指令： project(项目) page(页面)
  switch (type) {
    case 'page': {
      const langs: ILanguage[] = ['vue', 'react'] // 语言类型
      // if (!langs.includes(name)) return console.log(chalk.bold.red('无效创建指令'))
      // 执行创建指令
      const generator = new GeneratorPage(name, targetPath)
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