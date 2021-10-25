import inquirer from 'inquirer'
import { getRepoList } from './http'
import cliSpinners from 'cli-spinners'


// 添加加载动画
async function wrapLoading(fn: (...args: any) => any, message: string, ...args: any) {
  // 使用 ora 初始化，传入提示信息 message
  // 开始加载动画
  cliSpinners.dots

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    // spinner.dots();
    return result; 
  } catch (error) {
    // 状态为修改为失败
    // spinner.fail('Request failed, refetch ...')
    new Error('Request failed, refetch ...')
  } 
}

class Generator {
  name: string;
  targetDir: string;
  constructor (name: string, targetDir: string) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }


  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getRepo() {
    // 1）从远程拉取模板数据
    // const message ='waiting fetch template ...'
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    // const repoList = await oraPromise(getRepoList, message);
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map((item: any) => item.name);

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

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create(){
    // 1）获取模板名称
    const repo = await this.getRepo()
    
    console.log('用户选择了，repo=' + repo)
  }
}

export default Generator;
