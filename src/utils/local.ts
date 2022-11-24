import { encryption, decryption } from './crypto'
import Cookies from 'js-cookie'

/**
 * @description: localStorage封装
 */

/**
 * 设置本地缓存
 * @param key - 唯一值
 * @param value - 缓存值
 * @param expire - 缓存期限
 */
export function setLocalInfo(key: string, value: unknown) {
  const json = encryption(value)
  Cookies.set(key, json)
}

/**
 * 获取本地缓存数据
 * @param key - 唯一值
 */
export function getLocalInfo(key: string) {
  let result = Cookies.get(key) || ''
  if (result) result = decryption(result)
  
  return result
}

/**
 * 移除指定本地缓存
 * @param key - 唯一值
 */
export function removeLocalInfo(key: string) {
  Cookies.remove(key)
}