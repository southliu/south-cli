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
export abstract class ICreatePage<ITemplate, IApiTemplate, IGenerator> {
  public abstract name: string; // 文件名

  /**
   * 获取模板
   * @param props - 参数
   */
  abstract getTemplate(props: ITemplate): string;
  
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
  * @param props - 参数
   */
  abstract getApiTemplate(props: IApiTemplate): string;

  /**
   * 获取接口文件路径
   * @param apiName - 接口名称
   */
  abstract getApiFilePath(apiName: string): string;

  /**
   * 生成模板
   * @param props - 参数
   */
  abstract generatorTemplate(props: IGenerator): void;

  /** 创建页面 */
  abstract handleCreate() : void;
}