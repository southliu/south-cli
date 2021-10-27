import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import Generator from './Generator'

async function Create(name: string) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  const targetPath = path.join(cwd, name)

  // 判断是否存在当前文件
  if (fs.existsSync(targetPath)) {
    return console.log(`${chalk.red('×')} 文件已存在`)
  }

  // 执行创建指令
  const generator = new Generator(name, targetPath)
  generator.handleCreate()
}

export default Create