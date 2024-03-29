import { encrypt, decrypt } from 'crypto-js/aes'
import UTF8 from 'crypto-js/enc-utf8'
import md5 from 'crypto-js/md5'

// 加密密钥
const CRYPTO_SECRET = '__South_Cli_Secret__'

/**
 * 加密
 * @param data - 加密数据
 * @param secret - 加密密钥
 */
export function encryption(data: any, secret: string = CRYPTO_SECRET) {
  const code = JSON.stringify(data)
  return encrypt(code, secret).toString()
}

/**
 * 解密
 * @param data - 解密数据
 * @param secret - 解密密钥
 */
export function decryption(data: string, secret: string = CRYPTO_SECRET) {
  const bytes = decrypt(data, secret)
  const originalText = bytes.toString(UTF8)
  if (originalText) {
    return JSON.parse(originalText)
  }
  return null
}

/**
 * md5加密
 * @param data - 加密数据
 */
export function encryptMd5(data: string) {
  return md5(data).toString()
}