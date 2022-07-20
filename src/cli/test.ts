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

  fs.mkdirSync(__dirname, 'test123')
  fs.writeFileSync(`${__dirname}/test123/index.js`, code)
}