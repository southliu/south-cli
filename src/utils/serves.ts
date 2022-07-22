import axios from 'axios'

interface IResult {
  name: string;
}

// github中的cli项目名称
const CLI_NAME = 'south-cli'

// 请求配置
const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 3 * 1000
})

// 响应拦截
request.interceptors.response.use(res => {
  return res.data
})

/** 获取模板列表 */
 export async function getRepoList(): Promise<IResult[]> {
  return request.get(`/orgs/${CLI_NAME}/repos`)
}

/**
 * 获取版本信息
 * @param repo - 模板名称
 */
 export async function getTagList(repo: string): Promise<IResult[]> {
  return request.get(`/repos/${CLI_NAME}/${repo}/tags`)
}

/**
 * 下载链接
 * @param repo - 模板名称
 * @param tag - 标签名称
 */
export function getDownloadUrl(repo: string, tag?: string) {
  return `${CLI_NAME}/${repo}${tag ? `#${tag}` : ''}`
}