import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import error from 'error-symbol'
import Generator from './Generator'

async function Create(name: string) {
  console.log('Create:', name)
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  const targetPath = path.join(cwd, name)

  // 判断是否存在当前文件
  if (fs.existsSync(targetPath)) {
    return console.log(chalk.red.bold(`${error} 文件已存在!`))
  }

  const { type, template } = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: '请选择创建类型:',
      choices: [
        { name: '项目', value: 'project' },
        { name: '页面', value: 'page' }
      ]
    },
    {
      name: 'template',
      type: 'list',
      message: '请选择语言:',
      choices: [
        { name: 'React', value: 'react-template' },
        { name: 'Vue', value: 'vue-template' }
      ]
    }
  ])
  
  if (type === 'project') {
    const requestUrl = `south-cli/${template}`;
    new Generator(requestUrl)
  }
}

export default Create