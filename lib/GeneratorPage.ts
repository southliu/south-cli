import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import loading from 'loading-cli'
import path from 'path'
import { cyanColor, errorColor } from '../src/utils';
import { ILanguage } from '../types'

class GeneratorPage {
  name: string;
  targetDir: string;
  language: ILanguage;
  isSuccess: boolean;
  constructor(name: string, targetDir: string, language: ILanguage) {
    this.name = name
    this.targetDir = targetDir
    this.language = language
    this.isSuccess = true
  }

  // 加载动画
  async handleLoading(fn: Promise<any>, text: string) {
    const load = loading({
      text,
      color: 'cyan',
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    })
    load.start()

    try {
      // 执行方法
      const result = await fn;
      // 状态成功
      load.stop()
      this.isSuccess = true
      return result; 
    } catch (error) {
      // 状态失败
      load.stop()
      this.isSuccess = false
      console.log(`${errorColor('执行失败,请重试')}`)
      return false
    }
  }

  // 创建处理
  async handleCreate() {

    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\n创建${cyanColor(this.name)}页面成功!\n`)
    }
  }
}

export default GeneratorPage