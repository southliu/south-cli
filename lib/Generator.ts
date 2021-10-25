import inquirer from 'inquirer'
import { getRepoList, getTagList } from './http'
import cliSpinners from 'cli-spinners'
import downloadGitRepo from 'download-git-repo'
import util from 'util'
import path from 'path'
import chalk from 'chalk'

/**
 * TODO: 加载动画
 */
// 添加加载动画
async function wrapLoading(fn: (...args: any) => any, ...args: any) {
  // 使用 ora 初始化，传入提示信息 message
  // 开始加载动画

  try {
    // 执行传入方法 fn
    cliSpinners.dots
    const result = await fn(...args);
    // 状态为修改为成功
    return result; 
  } catch (error) {
    // 状态为修改为失败
    new Error('Request failed, refetch ...')
  } 
}

class Generator {
  name: string;
  targetDir: string;
  downloadGitRepo: any
  constructor (name: string, targetDir: string) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
     // 对 download-git-repo 进行 promise 化改造
     this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  
  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo: string, tag: string){

    // 1）拼接下载地址
    const requestUrl = `south-cli/${repo}${tag?'#'+tag:''}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称
  async getRepo() {
    // 1）从远程拉取模板数据
    // const message ='waiting fetch template ...'
    const repoList = await wrapLoading(getRepoList);
    // const repoList = await oraPromise(getRepoList, message);
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map((item: { name: string }) => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    // 3）return 用户选择的名称
    return repo;
  }


  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag
  async getTag(repo: string) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, repo);
    if (!tags) return;
    
    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item: { name: string }) => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create(){
    // 1）获取模板名称
    const repo = await this.getRepo()
    
    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)

    // 3）下载模板到模板目录
    await this.download(repo, tag)
    
    
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  yarn\r')
    console.log('  yarn dev\r\n')
  }
}

export default Generator;
