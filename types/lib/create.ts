import type { IPageFunctions } from 'types'

/**
 * 创建项目抽象类
 */
export abstract class ICreateProject {
  public abstract name: string; // 文件名
  public abstract targetDir: string; // 目标路径

  /** 获取GitHub模板 */
  abstract handleGetRepo() : void;

  /** 
   * 获取GitHub标签
   * @param repo - 模板名称
   */
  abstract handleGetTag(repo: string) : void;

  /**
   * 下载模板
   * @param repo - 模板名称
   * @param tag - 标签名称
   */
  abstract handleDownload(repo: string, tag: string): void;

  /** 创建处理 */
  abstract handleCreate(): void;
}

/**
 * 创建页面抽象类
 */
export abstract class ICreatePage {
  public abstract name: string; // 文件名

  /**
   * 获取模板
   * @param name - 页面唯一名称
   * @param rule - 权限
   * @param apiName - 接口名称
   * @param funcs - 功能数据
   */
  // abstract getTemplate(
  //   name: string,
  //   rule: string,
  //   apiName: string,
  //   funcs: IPageFunctions[],
  // ): string;

  
  /**
   * 获取数据模板
   * @param funcs - 功能数据
   */
  abstract getDateTemplate(funcs: IPageFunctions[]): string;

   /**
    * 获取模板接口文件路径
    * @param apiName - 接口名称
    */
  abstract getTemplateApiPath(apiName: string): string;

  /**
   * 获取接口模板
   * @param rule - 权限
   * @param name - 名称
   * @param funcs - 功能数据
   */
  abstract getApiTemplate(
    rule: string,
    name: string,
    funcs: IPageFunctions[]
  ): string;

  /**
   * 获取接口文件路径
   * @param apiName - 接口名称
   */
  abstract getApiFilePath(apiName: string): string;

  /**
   * 生成模板
   * @param code - 模板代码
   * @param data - 数据代码
   * @param api - 接口代码
   * @param apiName - 接口名称
   * @param filePath - 文件夹路径
   */
  abstract generatorTemplate(
    code: string,
    data: string,
    api: string,
    apiName: string,
    filePath: string
  ): void;

  /** 创建页面 */
  abstract handleCreate() : void;
}