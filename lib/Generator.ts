import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import loading from 'loading-cli'
import util from 'util'
import path from 'path'
import { getRepoList, getTagList } from './http'
import { CLI_NAME } from '../src/config'
import { cyanColor, errorColor, dimColor } from '../src/utils'

class Generator {
  name: string;
  targetDir: string;
  isSuccess: boolean
  constructor(name: string, targetDir: string) {
    this.name = name
    this.targetDir = targetDir
    this.isSuccess = false
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

  // 下载模板
  async hanleDownload(repo: string, tag: string) {
    const requestUrl = `${CLI_NAME}/${repo}${tag?'#'+tag:''}`
    // 下载方法添加promise
    const download = util.promisify(downloadGitRepo)
    // 获取参数位置
    const targetDir = path.resolve(process.cwd(), this.targetDir)
    
    // 调用下载
    await this.handleLoading(download(requestUrl, targetDir), '下载代码中...')
  }

  // 获取GitHub模板
  async handleGetRepo() {
    // 获取模板列表
    const repoList = await this.handleLoading(getRepoList(), '获取项目列表中...')
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
    const repoList = await this.handleLoading(getTagList(repo), '获取标签列表中...')
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
    console.log(dimColor(`  获取项目列表成功`))

    // 获取标签
    const tag = await this.handleGetTag(repo)
    console.log(dimColor(`  获取标签列表成功`))

    // 执行下载
    await this.hanleDownload(repo, tag)
    // 模板使用提示
    if (this.isSuccess) {
      console.log(`\r\n创建项目${cyanColor(this.name)}成功,请执行以下操作:`)
      console.log(`\r\n  cd ${cyanColor(this.name)}`)
      console.log('  yarn\r')
      console.log('  yarn dev\r\n')
    }
  }
}

export default Generator