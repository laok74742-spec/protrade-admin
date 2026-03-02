# ProTrade 控制面板 - Vercel 部署版

## 🚀 一键部署到 Vercel

### 步骤 1: 安装 Vercel CLI
```bash
npm i -g vercel
```

### 步骤 2: 登录 Vercel
```bash
vercel login
```

### 步骤 3: 部署
```bash
cd protrade-admin
vercel --prod
```

### 步骤 4: 设置环境变量（重要）
在 Vercel Dashboard 中设置：
- `ADMIN_PASSWORD` = 你的管理员密码（默认: admin123456）

## 📁 文件结构

```
protrade-admin/
├── api/
│   ├── config.js      # 配置管理 API
│   ├── devices.js     # 设备管理 API
│   └── stats.js       # 统计 API
├── index.html         # 控制面板前端
├── package.json
└── vercel.json        # Vercel 配置
```

## 🔌 API 接口

### 获取配置（设备调用）
```http
GET /api/config
```

### 更新配置（管理员）
```http
POST /api/config
Headers: Authorization: Bearer {password}
Body: { tradingEnabled: true }
```

### 设备心跳
```http
POST /api/devices
Body: { deviceId, model, screenMode }
```

### 获取统计
```http
GET /api/stats
Headers: Authorization: Bearer {password}
```

## 🔐 默认密码

**管理员密码**: `admin123456`

**强烈建议部署后立即修改！**

## 🌐 访问地址

部署后，Vercel 会给你一个类似这样的链接：
```
https://protrade-admin-xxxxx.vercel.app
```

## ⚠️ 注意事项

1. **数据存储**: 当前使用内存存储，重启后数据会丢失
2. **生产环境**: 建议使用 Vercel KV 或数据库
3. **密码安全**: 务必修改默认密码
4. **CORS**: 已配置允许所有域名访问

## 🔧 更新配置

修改代码后重新部署：
```bash
vercel --prod
```