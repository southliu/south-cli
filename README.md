# 使用教程：
### 全局安装
```
npm i south-cli -g
```

### 创建项目(project-name为项目名)
```
south create project-name
```

### 创建页面(page-name为页面名称)
```
south create-page page-name
```

### 帮助说明
```
south --help
```

### 本地使用(当前目录)
```
npm link
```

### 安装依赖
```
pnpm i
```

### 页面功能
```
搜索              顶部搜索框
新增-弹窗         当前页新增弹窗
新增-跳转         跳转至新增页面
删除              删除按钮
删除-批量删除      批量删除按钮
分页              分页栏
```

- 如果无法运行commitlint，请运行以下指令：

```
  npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```