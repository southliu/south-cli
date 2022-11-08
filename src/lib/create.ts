import path from 'path'
import { errorText, hasFile, hasFolder } from '../utils/helper'
import GeneratorProject from './generatorProject'
import GeneratorReact from './generatorReact'
import GeneratorVue from './generatorVue'

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
    return console.error(errorText(`  ${name}文件夹已存在`))
  }

  // 执行创建指令
  const generator = new GeneratorProject(name, filePath)
  generator.handleCreate()
}

/**
 * 生成Vue项目
 * @param name - 页面名称
 */
export async function createVue(name: string) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件所在路径
  const filePath = path.join(cwd, `${name}.vue`)

  // 如果文件夹存在则退出
  if (hasFile(filePath)) {
    return console.error(errorText(`  ${name}.vue已存在`))
  }

  // 执行创建命令
  const generator = new GeneratorVue(name)
  generator.handleCreate()
}

/**
 * 生成React项目
 * @param name - 页面名称
 */
export async function createReact(name: string) {
  // 获取当前命令行选择文件
  const cwd = process.cwd()
  // 文件所在路径
  const filePath = path.join(cwd, `${name}.tsx`)

  // 如果文件夹存在则退出
  if (hasFile(filePath)) {
    return console.error(errorText(`  ${name}.tsx已存在`))
  }

  // 执行创建命令
  const generator = new GeneratorReact(name)
  generator.handleCreate()
}

