import { ICreateProject } from '../../types/lib/create'
import { getDownloadUrl, getRepoList, getTagList } from '../utils/serves'
import { cyanText, dimText, errorText, handleLoading } from '../utils/helper'
import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import util from 'util'
import path from 'path'

/**
 * 创建项目类
 * 1.获取GitHub模板
 * 2.获取GitHub标签
 * 3.执行下载
 */
class GeneratorProject extends ICreateProject {
  name: string // 文件名
  targetDir: string // 目标路径
  constructor(name: string, targetDir: string) {
    super()
    this.name = name
    this.targetDir = targetDir
  }

  /** 获取GitHub模板 */
  async handleGetRepo() {
    try {
      // 获取模板列表
      const repoList = await handleLoading(getRepoList(), '获取项目列表中...')
      if (!repoList) return console.log('\n  暂无项目列表数据')
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
    } catch(err) {
      console.log(errorText('\n  获取项目列表失败'))
    }
  }

  /** 
   * 获取GitHub标签
   * @param repo - 模板名称
   */
  async handleGetTag(repo: string) {
    try {
      // 获取标签列表
      const tagList = await handleLoading(getTagList(repo), '获取标签列表中...')
      if (!tagList) return console.log('\n  暂无标签列表数据')
      // 过滤获取名称
      const tags = tagList.map((item: { name: string }) => item.name)

      // 咨询用户选择标签
      const { tag } = await inquirer.prompt({
        name: 'tag',
        type: 'list',
        choices: tags,
        message: '请选择标签:'
      })

      return tag
    } catch(err) {
      console.log(errorText('\n  获取项目列表失败'))
    }
  }

  /**
   * 下载模板
   * @param repo - 模板名称
   * @param tag - 标签名称
   */
  async handleDownload(repo: string, tag: string) {
    try {
      const requestUrl = getDownloadUrl(repo, tag)
      // 下载方法添加promise
      const download = util.promisify(downloadGitRepo)
      // 获取参数位置
      const targetDir = path.resolve(process.cwd(), this.targetDir)
  
      // 调用下载
      await handleLoading(
        download(requestUrl, targetDir),
        '下载代码中...'
      )
    } catch(err) {
      // 错误处理
      console.log(errorText('\n  下载失败'))
    }
  }

  /** 创建处理 */
  async handleCreate() {
    try {
      // 1.获取GitHub模板
      const repo = await this.handleGetRepo()
      if (!repo) return console.log(errorText('  网络不佳，请重新尝试'))
      console.log(dimText(`  获取项目列表成功`))

      // 2.获取GitHub标签
      const tag = await this.handleGetTag(repo)
      console.log(dimText(`  获取项目列表成功`))

      // 3.执行下载
      await this.handleDownload(repo, tag)

      // 模板使用提示
      console.log(`\r\n创建项目${cyanText(this.name)}成功,请执行以下操作:`)
      console.log(`\r\n  cd ${cyanText(this.name)}`)
      console.log('  pnpm i\r')
      console.log('  pnpm dev\r\n')
    } catch(err) {
      console.log(errorText('\n  创建失败'))
    }
  }
}

export default GeneratorProject