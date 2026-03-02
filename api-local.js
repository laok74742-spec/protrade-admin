// GitHub Pages 版控制后台（静态版，无需服务器）
// 使用 localStorage 模拟数据库，适合演示

const DB_KEY = 'protrade_db';

// 获取数据
function getDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {
        config: {
            coverEnabled: true,
            tradingEnabled: false,
            registerEnabled: true,
            updatedAt: new Date().toISOString()
        },
        devices: [],
        stats: { onlineDevices: 0, tradingUsers: 0 }
    };
}

// 保存数据
function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// 模拟API响应
window.ProTradeAPI = {
    // 获取配置
    getConfig() {
        const db = getDB();
        return {
            success: true,
            config: db.config,
            stats: db.stats
        };
    },
    
    // 更新配置
    updateConfig(updates) {
        const db = getDB();
        Object.assign(db.config, updates, { updatedAt: new Date().toISOString() });
        saveDB(db);
        return { success: true, config: db.config };
    },
    
    // 获取设备列表
    getDevices() {
        const db = getDB();
        return {
            devices: db.devices,
            total: db.devices.length
        };
    },
    
    // 添加/更新设备
    updateDevice(deviceId, data) {
        const db = getDB();
        const index = db.devices.findIndex(d => d.id === deviceId);
        
        if (index >= 0) {
            db.devices[index] = { ...db.devices[index], ...data };
        } else {
            db.devices.push({ id: deviceId, ...data });
        }
        
        // 更新统计
        db.stats.onlineDevices = db.devices.filter(d => d.online).length;
        db.stats.tradingUsers = db.devices.filter(d => d.screenMode === 'trading').length;
        
        saveDB(db);
        return { success: true };
    },
    
    // 强制所有设备切换
    forceAllDevices(mode) {
        const db = getDB();
        db.config.forcedMode = mode;
        db.config.forcedAt = new Date().toISOString();
        
        db.devices.forEach(device => {
            if (device.online) {
                device.screenMode = mode;
                device.forcedSwitch = true;
            }
        });
        
        saveDB(db);
        return { 
            success: true, 
            affectedCount: db.devices.filter(d => d.online).length 
        };
    }
};