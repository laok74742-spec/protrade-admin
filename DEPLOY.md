# ProTrade 控制后台 - 部署指南

## 🚀 一键部署到 Vercel

### 方式1：命令行部署（推荐）

```bash
# 1. 进入项目目录
cd /Users/laosan/.openclaw/workspace/projects/protrade-admin

# 2. 安装 Vercel CLI
npm install -g vercel

# 3. 登录 Vercel
vercel login

# 4. 部署
vercel --prod
```

部署完成后会显示类似：
```
🔍  Inspect: https://vercel.com/username/protrade-admin/xxx
✅  Production: https://protrade-admin-xxxx.vercel.app
```

### 方式2：GitHub + Vercel 自动部署

1. 在 GitHub 创建新仓库 `protrade-admin`
2. 上传代码到 GitHub
3. 访问 https://vercel.com 导入项目
4. 自动部署完成

---

## 📁 项目结构

```
protrade-admin/
├── api/
│   ├── index.js      # API 入口
│   ├── config.js     # 配置管理
│   ├── devices.js    # 设备管理
│   └── db.js         # 内存数据库
├── index.html        # 控制面板
├── package.json      # 项目配置
├── vercel.json       # Vercel 配置
└── DEPLOY.md         # 本文件
```

---

## 🔐 默认配置

### 管理员密码
- **默认密码**: `admin123456`
- **建议**: 部署后立即修改

### 初始状态
- ✅ 马甲包显示: **开启**
- ❌ 交易功能: **关闭**
- ✅ 新用户注册: **开启**

---

## 🌐 部署后使用

### 访问控制面板
```
https://your-project.vercel.app
```

### API 端点
```
GET  /api/config         # 获取配置（设备调用）
POST /api/config         # 更新配置（需密码）
GET  /api/devices        # 获取设备列表
POST /api/device/control # 控制设备
```

---

## 📱 在 APP 中接入

修改 `fittrack-pro` 的 SDK：

```javascript
// 更新 API 地址为你的 Vercel 地址
const API_BASE = 'https://protrade-admin-xxxx.vercel.app/api';
```

---

## ⚠️ 注意事项

1. **免费版限制**: Vercel Hobby 版有使用限制，适合小规模使用
2. **数据存储**: 使用内存数据库，重启后数据会丢失
3. **生产环境**: 建议升级到 Vercel Pro + Vercel KV 数据库

---

## 🔧 修改管理员密码

编辑 `api/config.js`：

```javascript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '你的新密码';
```

或者设置环境变量：

```bash
vercel env add ADMIN_PASSWORD
```

---

## 📞 技术支持

部署问题联系：支持邮箱

---

**一键部署命令:**

```bash
cd /Users/laosan/.openclaw/workspace/projects/protrade-admin && npm i -g vercel && vercel login && vercel --prod
```