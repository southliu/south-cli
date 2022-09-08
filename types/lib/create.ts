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

  /** 创建页面 */
  abstract handleCreate() : void;
}