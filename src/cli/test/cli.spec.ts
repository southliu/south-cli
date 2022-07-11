import { test, expect, vi } from 'vitest'
import { getLanguage } from '../../utils/lange'

test('cli', () => {
  expect(true).toBe(true)
})

// 获取语言
test('获取语言', async () => {
  // 执行获取语言
  const lange = await getLanguage()
  console.log('lange:', lange)  

  expect(lange).resolves.toBe('vue')
})

// create-page
test.skip('通过create-page生成页面', () => {
  // 执行创建方法
  // createPage(language)
})