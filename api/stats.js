const { globalConfig, devices, stats } = require('./db');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

function verifyAuth(req) {
  const auth = req.headers.authorization;
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 计算实时统计
    const allDevices = Array.from(devices.values());
    const onlineDevices = allDevices.filter(d => {
      const lastActive = new Date(d.lastActive);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return lastActive > fiveMinutesAgo;
    });
    
    const stats = {
      onlineDevices: onlineDevices.length,
      tradingUsers: onlineDevices.filter(d => d.screenMode === 'trading').length,
      totalDevices: devices.size,
      todayVolume: Math.floor(Math.random() * 50000) + 20000, // 模拟数据
      riskBlocked: 0
    };
    
    return res.json({
      success: true,
      stats
    });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};