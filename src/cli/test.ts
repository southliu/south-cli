import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'

export function renderReact() {
  const templateCode = fs.readFileSync(
    path.resolve(__dirname, "../../templates/React/test.ejs")
  )
  
  const code = ejs.render(templateCode.toString(), {
    isSearch: true,
    isPagination: true,
    isCreate: true,
    isBatchDelete: true,
  })


    console.log('templateCode:', templateCode)
    console.log('code:', code)
    
    // 获取当前命令行选择文件
    const cwd = process.cwd()
    // 文件所在路径
    const filePath = path.join(cwd, '/test.ts')
    fs.outputFileSync(filePath, code)
}