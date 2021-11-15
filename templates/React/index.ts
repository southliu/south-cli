import { IPageFunctions } from "../../types";

export function handleReactFile(functions: IPageFunctions[]) {
  let render = '' // 渲染数据
  const paginationData: string[] = [] // 分页数据

  // 头部插件
  const importDatas: string[] = [
    `import { memo, useState, useEffect } from 'react';\n`,
    `import API from '@api/home';\n`
  ]

  // 函数数据
  const functionDatas: string[] = [
    '\nfunction Page() {',
    '\r\n  const defaultData: IDefaultData[] = []'
  ]

  // 渲染数据
  const renderDatas: string[] = [
    '\r\n\n  return (',
    '\r\n    <div>test</div>',
    `\r\n${paginationData.toString()}`,
    '\r\n  )',
  ]
  
  // 结尾数据
  const endDatas: string[] = [
    '\n}\n',
    '\nexport default memo(Page)',
  ]

  // 当有分页数据时
  if (functions.includes('pagination')) {
    paginationData.push('\r\n    <pagination />')
  }

  importDatas.forEach(e => render += e)
  functionDatas.forEach(e => render += e)
  renderDatas.forEach(e => render += e)
  endDatas.forEach(e => render += e)

  return render
}