const { globalConfig, devices, stats } = require('./db');

// 管理员验证
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

function verifyAuth(req) {
  const auth = req.headers.authorization;
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

module.exports = (req, res) => {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 获取配置（设备调用）
  if (req.method === 'GET') {
    return res.json({
      success: true,
      config: globalConfig,
      stats: {
        onlineDevices: stats.onlineDevices,
        tradingUsers: stats.tradingUsers
      }
    });
  }
  
  // 更新配置（管理员调用）
  if (req.method === 'POST') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const updates = req.body;
    Object.assign(globalConfig, updates, { updatedAt: new Date().toISOString() });
    
    return res.json({
      success: true,
      config: globalConfig,
      message: '配置已更新'
    });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};