import axios from 'axios'

axios.interceptors.response.use(res => {
  
  return res.data;
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://api.github.com/orgs/south-cli/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagList(repo: string) {
  return axios.get(`https://api.github.com/repos/south-cli/${repo}/tags`)
}

export {
  getRepoList,
  getTagList
}
