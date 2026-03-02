// API 路由入口
const configHandler = require('./config');
const devicesHandler = require('./devices');

module.exports = (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Device-ID');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 路由分发
  const url = req.url || '';
  
  if (url.startsWith('/api/config')) {
    return configHandler(req, res);
  }
  
  if (url.startsWith('/api/device') || url.startsWith('/api/devices')) {
    return devicesHandler(req, res);
  }
  
  // 默认返回配置
  if (url === '/api' || url === '/api/') {
    return res.json({
      name: 'ProTrade Admin API',
      version: '1.0.0',
      endpoints: [
        '/api/config - 配置管理',
        '/api/devices - 设备管理',
        '/api/device/heartbeat - 设备心跳'
      ]
    });
  }
  
  res.status(404).json({ error: 'API endpoint not found' });
};