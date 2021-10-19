import fs from 'fs'

/**
 * 判断文件是否存在的函数
 * @param path_way 文件路径
 * @returns 
 */
export function isFileExisted(path_way: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.access(path_way, (err) => {
      if (err) {
        reject(false);//"不存在"
      } else {
        resolve(true);//"存在"
      }
    })
  })
};
