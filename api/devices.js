// 设备管理 API
const { globalConfig, devices, stats } = require('./db');

// 验证管理员
function verifyAdmin(req) {
  const auth = req.headers['authorization'];
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Device-ID, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const deviceId = req.headers['device-id'] || req.body?.deviceId;
  
  // 设备心跳上报
  if (req.method === 'POST' && req.url === '/api/device/heartbeat') {
    const { model, os, screenMode, location } = req.body || {};
    
    const device = devices.get(deviceId) || {
      id: deviceId,
      createdAt: new Date().toISOString(),
      balance: 0,
      status: 'active'
    };
    
    device.lastActive = new Date().toISOString();
    device.model = model;
    device.os = os;
    device.screenMode = screenMode || device.screenMode || 'fitness';
    device.location = location;
    device.online = true;
    
    // 检查是否收到强制切换指令
    const shouldForceSwitch = device.lastForcedMode !== globalConfig.forcedMode && globalConfig.forcedMode;
    
    devices.set(deviceId, device);
    
    // 更新统计
    stats.onlineDevices = Array.from(devices.values()).filter(d => d.online).length;
    stats.tradingUsers = Array.from(devices.values()).filter(d => d.screenMode === 'trading').length;
    
    return res.json({
      success: true,
      config: globalConfig,
      forceSwitch: shouldForceSwitch ? globalConfig.forcedMode : null
    });
  }
  
  // 确认强制切换完成（设备调用）
  if (req.method === 'POST' && req.url === '/api/device/ack-force') {
    const device = devices.get(deviceId);
    if (device) {
      device.lastForcedMode = globalConfig.forcedMode;
      device.screenMode = globalConfig.forcedMode;
      devices.set(deviceId, device);
    }
    return res.json({ success: true });
  }
  
  // 获取设备列表（管理员）
  if (req.method === 'GET' && req.url === '/api/devices') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const deviceList = Array.from(devices.values())
      .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
      .slice(0, 50);
    
    return res.json({
      devices: deviceList,
      total: devices.size
    });
  }
  
  // 远程控制单个设备（管理员）
  if (req.method === 'POST' && req.url === '/api/device/control') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { deviceId: targetId, action, mode } = req.body || {};
    
    const device = devices.get(targetId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    if (action === 'switchMode') {
      device.screenMode = mode;
      device.forcedSwitch = true;
      device.forcedAt = new Date().toISOString();
    } else if (action === 'freeze') {
      device.status = 'frozen';
    } else if (action === 'unfreeze') {
      device.status = 'active';
    }
    
    devices.set(targetId, device);
    
    return res.json({
      success: true,
      device: {
        id: device.id,
        screenMode: device.screenMode,
        status: device.status
      }
    });
  }
  
  // 🔴 强制所有设备切换到指定模式（管理员）
  if (req.method === 'POST' && req.url === '/api/devices/force-all') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { mode } = req.body || {};
    
    if (!mode || !['fitness', 'trading'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }
    
    // 更新全局强制模式
    globalConfig.forcedMode = mode;
    globalConfig.forcedAt = new Date().toISOString();
    
    // 立即更新所有在线设备
    let affectedCount = 0;
    devices.forEach((device, id) => {
      if (device.online) {
        device.screenMode = mode;
        device.forcedSwitch = true;
        device.forcedAt = new Date().toISOString();
        devices.set(id, device);
        affectedCount++;
      }
    });
    
    // 更新统计
    stats.tradingUsers = Array.from(devices.values()).filter(d => d.screenMode === 'trading').length;
    
    return res.json({
      success: true,
      message: `已强制所有在线设备切换到${mode === 'trading' ? '交易' : '健身'}模式`,
      affectedCount,
      forcedMode: mode
    });
  }
  
  res.status(404).json({ error: 'Not found' });
};