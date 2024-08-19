# South-CLI

[![npm][npm-image]][npm-url]
[![l][l-image]][l-url]

[npm-image]: https://img.shields.io/npm/v/south-cli
[npm-url]: https://www.npmjs.com/package/south-cli
[l-image]: https://img.shields.io/npm/l/south-cli
[l-url]: https://github.com/southliu/south-cli

### CLI脚手架生成项目和页面。

## 💻 安装
```
npm i south-cli -g
```

## ✨ 使用教程
### 创建项目
```
south create project-name
```

### 创建Vue页面
```
south create-vue page-name
```

### 创建React页面
```
south create-react page-name
```

## 🤖 帮助说明
```
south --help
```

## 🌏 本地使用
```
git clone git@github.com:southliu/south-cli.git
cd south-cli
pnpm i
pnpm link:dev
```

## 🎯 页面功能
| 功能 | 功能名 | 功能说明 |
| --- | --- | --- |
| search | 搜索 | 顶部搜索框 |
| create | 新增-弹窗 | 当前页新增弹窗 |
| update | 编辑-弹窗 | 当前页编辑弹窗 |
| createPage | 新增-跳转 | 跳转至新增页面 |
| delete | 删除 | 删除按钮 |
| batchDelete | 删除-批量删除 | 批量删除按钮 |
| pagination | 分页 | 分页栏 |
