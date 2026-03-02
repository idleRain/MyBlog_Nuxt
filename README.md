# My Blog - Nuxt 3 全栈博客应用

一个使用 Nuxt 3 构建的现代化全栈个人博客应用。

## 特性

- 🎨 **现代化设计** - 基于 Nuxt 3 / Vue 3 的响应式前端界面
- 📏 **代码质量保证** - 集成 ESLint、Prettier
- 🐙 **Git Hooks** - 自动代码检查和提交规范验证
- 🗄️ **多数据库支持** - MySQL + MongoDB
- 🔐 **用户认证** - JWT 认证系统
- 📝 **Markdown 编辑器** - 支持实时预览
- 💬 **评论系统** - 支持嵌套回复
- 🔍 **全文搜索** - 文章搜索功能
- 📁 **文件管理** - 图片上传和管理

## 技术栈

### 前端
- Vue 3
- Nuxt 3
- TypeScript
- Tailwind CSS
- shadcn-vue

### 后端
- Nuxt Server API
- MySQL
- MongoDB

### 开发工具
- ESLint
- Prettier
- Husky
- lint-staged
- commitlint
- Vitest

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+
- MongoDB 6.0+

### 安装依赖

```bash
bun install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

### 启动开发服务器

```bash
bun run dev
```

### 构建生产版本

```bash
bun run build
```

## 项目结构

```
├── assets/          # 静态资源
├── components/      # Vue 组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── pages/           # 页面组件
├── plugins/         # Nuxt 插件
├── public/          # 公共静态文件
├── server/          # 服务端代码
│   ├── api/         # API 路由
│   ├── middleware/  # 服务端中间件
│   └── utils/       # 服务端工具函数
├── types/           # TypeScript 类型定义
└── nuxt.config.ts   # Nuxt 配置文件
```

## 脚本命令

| 命令 | 描述 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run generate` | 生成静态站点 |
| `bun run lint` | 运行 ESLint 检查 |
| `bun run lint:fix` | 自动修复 ESLint 问题 |
| `bun run format` | 格式化代码 |
| `bun run typecheck` | TypeScript 类型检查 |
| `bun run test` | 运行测试 |

## Git 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

## 许可证

MIT License
