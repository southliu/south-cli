import ProgressBar from 'progress'
import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import loading from 'loading-cli'
import chalk from 'chalk'
import error from 'error-symbol'
import { getRepoList, getTagList } from './http'
import { AxiosResponse } from 'axios'

// 加载动画
async function handleLoading(fn: Promise<AxiosResponse<any, any>>, text = '加载中。。。') {
  const load = loading(text)
  load.start()

  try {
    // 执行成功
   const result = await fn
   load.stop()
   return result
  } catch {
    // 执行失败
    load.stop()
    console.log(chalk.red.bold(`${error} 函数错误!`))
    return false
  }
}
class Generator {
  name: string;
  constructor(name: string) {
    this.name = name
  }

  // 下载模板
  async hanleDownload() {
  }

  // 获取GitHub模板
  async handleGetRepo() {
    const repoList = await handleLoading(getRepoList())
    console.log('repoList:', repoList)
  }

  // 获取GitHub标签
  async handleGetTag() {}

  async handleCreate() {
    this.handleGetRepo()
  }
}

export default Generator