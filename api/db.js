// 简化的内存数据库（生产环境应使用 Vercel KV 或数据库）
let globalConfig = {
  coverEnabled: true,
  tradingEnabled: false,
  registerEnabled: true,
  tradingUrl: 'https://protrade.example.com/mobile',
  apiUrl: 'https://api.protrade.example.com',
  minAmount: 10,
  payoutRate: '87%',
  secretCode: 'PRO2024',
  updatedAt: new Date().toISOString()
};

let devices = new Map();
let stats = {
  totalDevices: 0,
  onlineDevices: 0,
  tradingUsers: 0,
  todayVolume: 0
};

module.exports = { globalConfig, devices, stats };