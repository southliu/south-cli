import axios from 'axios'
import { CLI_NAME } from '../utils/config'

axios.interceptors.response.use(res => {
  return res.data
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get(`https://api.github.com/orgs/${CLI_NAME}/repos`)
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function getTagList(repo: string) {
  return axios.get(`https://api.github.com/repos/${CLI_NAME}/${repo}/tags`)
}

export {
  getRepoList,
  getTagList
}
