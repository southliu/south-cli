# South-CLI

[![npm][npm-image]][npm-url]
[![l][l-image]][l-url]

[npm-image]: https://img.shields.io/npm/v/south-cli
[npm-url]: https://www.npmjs.com/package/south-cli
[l-image]: https://img.shields.io/npm/l/south-cli
[l-url]: https://github.com/southliu/south-cli

### CLI脚手架生成项目和页面。

## 使用教程：
### 全局安装
```
npm i south-cli -g
```

### 创建项目(project-name为项目名)
```
south create project-name
```

### 创建Vue页面(page-name为页面名称)
```
south create-vue page-name
```

### 创建React页面(page-name为页面名称)
```
south create-react page-name
```

### 帮助说明
```
south --help
```

### 本地使用(当前目录)
```
pnpm link:dev
```

### 安装依赖
```
pnpm i
```

### 页面功能
| 功能名 | 功能说明 |
| --- | --- |
| 搜索 | 顶部搜索框 |
| 新增-弹窗 | 当前页新增弹窗 |
| 新增-跳转 | 跳转至新增页面 |
| 删除 | 删除按钮 |
| 删除-批量删除 | 批量删除按钮 |
| 分页 | 分页栏 |
