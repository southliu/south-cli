import ProgressBar from 'progress'
import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import loading from 'loading-cli'
import chalk from 'chalk'
import util from 'util'
import path from 'path'
import { getRepoList, getTagList } from './http'
import { CLI_NAME } from '../src/config'

// 加载动画
async function handleLoading(fn: Promise<any>, text = '加载中。。。') {
  const load = loading(text)
  load.start()

  try {
    // 执行方法
    const result = await fn;
    // 状态成功
    load.stop()
    return result; 
  } catch (error) {
    // 状态失败
    load.stop()
    console.log(chalk.red.bold(`执行失败,请重试!`))
    return false
  }
}

class Generator {
  name: string;
  targetDir: string;
  constructor(name: string,targetDir: string) {
    this.name = name
    this.targetDir = targetDir
  }

  // 下载模板
  async hanleDownload(repo: string, tag: string) {
    const requestUrl = `${CLI_NAME}/${repo}${tag?'#'+tag:''}`
    // 下载方法添加promise
    const download = util.promisify(downloadGitRepo)
    // 获取参数位置
    const targetDir = path.resolve(process.cwd(), this.targetDir)
    // 调用下载
    await handleLoading(download(requestUrl, targetDir), '下载中。。。')
  }

  // 获取GitHub模板
  async handleGetRepo() {
    // 获取模板列表
    const repoList = await handleLoading(getRepoList())
    if (!repoList) return
    // 过滤获取名称
    const repos = repoList.map((item: { name: string }) => item.name)

    // 咨询用户选择项目
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择项目:'
    })

    return repo
  }

  // 获取GitHub标签
  async handleGetTag(repo: string) {
    // 获取标签列表
    const repoList = await handleLoading(getTagList(repo))
    if (!repoList) return
    // 过滤获取名称
    const repos = repoList.map((item: { name: string }) => item.name)

    // 咨询用户选择项目
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: repos,
      message: '请选择标签:'
    })

    return tag
  }

  // 创建处理
  async handleCreate() {
    // 获取模板
    const repo = await this.handleGetRepo()
    // 获取标签
    const tag = await this.handleGetTag(repo)
    // 执行下载
    await this.hanleDownload(repo, tag)
    // 模板使用提示
    console.log(`\r\n成功创建项目${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  yarn\r')
    console.log('  yarn dev\r\n')
  }
}

export default Generator