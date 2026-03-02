# 🚀 ProTrade 控制后台 - Vercel 部署指南

## 📋 快速部署（2分钟）

### 方式1：Vercel CLI 命令行部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login
# 会打开浏览器让你授权登录

# 3. 进入项目目录
cd /Users/laosan/.openclaw/workspace/projects/protrade-admin

# 4. 部署
vercel --prod

# 5. 获得线上地址
# 🔗  https://protrade-admin-xxxxx.vercel.app
```

### 方式2：GitHub + Vercel 自动部署（推荐）

#### 步骤1：创建 GitHub 仓库
```bash
# 在 protrade-admin 目录下
git remote add origin https://github.com/YOUR_USERNAME/protrade-admin.git
git branch -M main
git push -u origin main
```

#### 步骤2：导入 Vercel
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库 `protrade-admin`
3. 点击 **Deploy**
4. 等待部署完成（约1分钟）

---

## ⚙️ 环境变量配置

部署后设置环境变量（可选，提高安全性）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ADMIN_PASSWORD` | `your_secure_password` | 管理后台密码 |

设置步骤：
1. 访问 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加变量
4. 重新部署

---

## 🔗 部署后配置

### 1. 获取 API 地址
部署完成后，你会得到一个地址：
```
https://protrade-admin-xxxxx.vercel.app
```

### 2. 更新 FitTrack Pro 的 API 地址
编辑 `fittrack-pro/www/index.html`：
```javascript
// 找到这行，替换为你的地址
const API_BASE = 'https://protrade-admin-xxxxx.vercel.app/api';
```

### 3. 重新构建 APK
```bash
cd fittrack-pro
# 重新打包并上传到 GitHub Actions 构建
```

---

## 📱 使用控制后台

部署完成后，访问你的地址：

```
https://protrade-admin-xxxxx.vercel.app
```

### 登录
- **密码**: `admin123456`（默认）
- 建议首次登录后修改

### 功能
- 📊 查看在线设备统计
- 🎛️ 一键开关马甲包/交易功能
- 📱 查看所有连接的设备
- 🔴 强制所有设备切换到指定模式

---

## 🔄 后续更新

修改代码后重新部署：

```bash
# 方式1：Vercel CLI
cd protrade-admin
vercel --prod

# 方式2：Git 推送（如果使用GitHub集成）
git add .
git commit -m "Update: xxx"
git push
# Vercel 会自动重新部署
```

---

## 🆘 常见问题

### Q: 部署失败 "Command not found"
**A**: 安装 Node.js：https://nodejs.org

### Q: "You must login first"
**A**: 运行 `vercel login` 授权

### Q: API 返回 404
**A**: 检查 `vercel.json` 配置，确保路由正确

### Q: CORS 错误
**A**: API 已配置 CORS，检查请求的 URL 是否正确

---

## 📊 免费额度

Vercel Hobby（免费版）限制：
- 100GB 带宽/月
- 1000 构建/月
- 10GB 存储

对于控制后台足够使用。

---

## 🔐 安全建议

1. **修改默认密码** - 首次登录后修改
2. **使用 HTTPS** - Vercel 自动提供 SSL
3. **限制访问** - 可以配置 IP 白名单（Pro版功能）
4. **定期更新** - 保持依赖更新

---

## 🎯 下一步

部署完成后：
1. ✅ 测试控制后台是否正常工作
2. ✅ 更新 FitTrack Pro 的 API 地址
3. ✅ 构建 APK 并测试远程控制
4. ✅ 上架 Google Play

---

**准备好部署了吗？** 运行上面的命令即可！🎉