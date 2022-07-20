import axios from 'axios'

interface IResult {
  name: string;
}

// github中的cli项目名称
const CLI_NAME = 'south-cli'

// 响应拦截
axios.interceptors.response.use(res => {
  return res.data
})

/** 获取模板列表 */
 export async function getRepoList(): Promise<IResult[]> {
  return axios.get(`https://api.github.com/orgs/${CLI_NAME}/repos`)
}

/**
 * 获取版本信息
 * @param repo - 模板名称
 */
 export async function getTagList(repo: string): Promise<IResult[]> {
  return axios.get(`https://api.github.com/repos/${CLI_NAME}/${repo}/tags`)
}

/**
 * 下载链接
 * @param repo - 模板名称
 * @param tag - 标签名称
 */
export function getDownloadUrl(repo: string, tag: string) {
  return `${CLI_NAME}/${repo}${tag ? `#${tag}` : ''}`
}