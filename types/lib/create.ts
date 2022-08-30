/**
 * 创建项目抽象类
 */
export abstract class ICreateProject {
  public abstract name: string; // 文件名
  public abstract targetDir: string; // 目标路径

  /**
   * 下载模板
   * @param repo - 模板名称
   */
  abstract handleDownload(repo: string): void;

  /** 获取GitHub模板 */
  abstract handleGetRepo() : void;

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