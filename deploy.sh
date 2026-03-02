#!/bin/bash
# 一键部署脚本

echo "🚀 ProTrade 控制后台一键部署"
echo "==============================="
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "📦 步骤1: 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 环境检查通过${NC}"

# 安装Vercel CLI
echo ""
echo "📦 步骤2: 安装 Vercel CLI..."
npm install -g vercel

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Vercel CLI 安装失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLI 安装成功${NC}"

# 登录Vercel
echo ""
echo "📦 步骤3: 登录 Vercel..."
echo -e "${YELLOW}⚠ 将打开浏览器，请完成授权登录${NC}"
vercel login

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 登录失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 登录成功${NC}"

# 部署
echo ""
echo "📦 步骤4: 部署到 Vercel..."
cd "$(dirname "$0")"
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 部署成功！${NC}"
    echo ""
    echo "请保存上面的URL地址，这是你的控制后台链接"
    echo ""
    echo "下一步:"
    echo "1. 复制上面的URL地址"
    echo "2. 更新 fittrack-pro/www/index.html 中的 API_BASE"
    echo "3. 推送代码到 GitHub 自动构建APK"
else
    echo -e "${RED}✗ 部署失败${NC}"
    exit 1
fi