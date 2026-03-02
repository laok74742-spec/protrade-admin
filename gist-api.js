// 使用 GitHub Gist 作为远程数据库
// 无需部署服务器，全球可访问

const GIST_ID = 'YOUR_GIST_ID'; // 创建Gist后替换
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; // 可选，用于写操作

class GistDB {
    constructor(gistId, token) {
        this.gistId = gistId;
        this.token = token;
        this.baseUrl = `https://api.github.com/gists/${gistId}`;
    }
    
    // 读取数据
    async read() {
        try {
            const response = await fetch(this.baseUrl);
            const gist = await response.json();
            const content = gist.files['protrade-db.json'].content;
            return JSON.parse(content);
        } catch (e) {
            // 默认数据
            return {
                config: {
                    coverEnabled: true,
                    tradingEnabled: false,
                    registerEnabled: true,
                    forcedMode: null,
                    updatedAt: new Date().toISOString()
                },
                devices: {},
                stats: { onlineDevices: 0, tradingUsers: 0 }
            };
        }
    }
    
    // 写入数据（需要Token）
    async write(data) {
        if (!this.token) {
            throw new Error('GitHub Token required for write');
        }
        
        const response = await fetch(this.baseUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'protrade-db.json': {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            })
        });
        
        return response.ok;
    }
}

// 导出API
window.RemoteAPI = GistDB;