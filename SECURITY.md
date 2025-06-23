# 安全配置指南

## Coze 服务端代理模式

本项目实现了安全的服务端代理模式来保护 Coze API 的敏感信息，避免在客户端暴露 token 和其他敏感配置。

## 🔒 安全特性

### 1. 服务端代理
- 所有 Coze API 调用通过服务端代理 `/api/coze-proxy`
- 敏感信息（token、bot ID）仅存储在服务端环境变量中
- 客户端无法直接访问真实的 API 凭据

### 2. 会话令牌
- 为每个客户端会话生成临时令牌
- 令牌包含时间戳和会话标识
- 支持令牌刷新机制

### 3. 请求验证
- Origin 验证：检查请求来源域名
- Referer 验证：防止跨站请求伪造
- 请求体验证：确保请求格式正确

## 🛠️ 配置说明

### 环境变量
在 `.env.local` 文件中配置以下变量：

```bash
# Coze API 配置（服务端专用）
COZE_TOKEN=pat_FrjTN0mlQw7j9tjzkwnev4FwV44Wxp3srLxvT6CqxMyEneOE7oQm6wSqjOVHIEtX
COZE_BOT_ID=7499463698092867610
```

**重要提醒：**
- 不要使用 `NEXT_PUBLIC_` 前缀
- 确保 `.env.local` 文件在 `.gitignore` 中
- 生产环境中使用环境变量管理服务

### 允许的域名
在 `/app/api/coze-proxy/route.ts` 中配置允许的请求来源：

```typescript
const allowedOrigins = [
    'http://localhost:3000',
    'https://www.lulabs.org/', // 替换为你的实际域名
];
```

## 🚀 API 使用方式

### 获取配置
```typescript
const response = await fetch('/api/coze-proxy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'getConfig'
    })
});
```

### 聊天请求
```typescript
const response = await fetch('/api/coze-proxy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'chat',
        payload: {
            message: 'Hello',
            // 其他聊天参数
        }
    })
});
```

## 🔧 进一步安全增强

### 1. 用户认证
```typescript
// 在代理中添加用户认证
const session = await getServerSession(authOptions);
if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 2. 速率限制
```typescript
// 实现请求频率限制
const rateLimiter = new Map();
const clientId = request.ip || 'unknown';
const requests = rateLimiter.get(clientId) || [];

if (requests.length >= 10) { // 每分钟最多10次请求
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

### 3. 请求日志
```typescript
// 记录所有API调用
console.log(`Coze API call: ${action} from ${request.ip} at ${new Date().toISOString()}`);
```

### 4. JWT 令牌
```typescript
import jwt from 'jsonwebtoken';

// 生成更安全的会话令牌
function generateSessionToken(originalToken: string): string {
    return jwt.sign(
        { 
            cozeAccess: true,
            timestamp: Date.now()
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );
}
```

## 📋 安全检查清单

- [ ] 环境变量不使用 `NEXT_PUBLIC_` 前缀
- [ ] `.env.local` 文件已添加到 `.gitignore`
- [ ] 配置了正确的允许域名列表
- [ ] 实现了请求来源验证
- [ ] 添加了错误处理和日志记录
- [ ] 考虑实现用户认证
- [ ] 考虑实现速率限制
- [ ] 定期轮换 API 令牌

## 🚨 注意事项

1. **生产环境部署**：确保在生产环境中正确配置环境变量
2. **HTTPS**：生产环境必须使用 HTTPS
3. **监控**：监控异常的 API 调用模式
4. **备份**：定期备份重要配置
5. **更新**：及时更新依赖包和安全补丁

## 📞 故障排除

### 常见问题

1. **配置获取失败**
   - 检查环境变量是否正确设置
   - 确认 API 路由是否正常工作

2. **Origin 验证失败**
   - 检查 `allowedOrigins` 配置
   - 确认请求来源域名正确

3. **Token 刷新失败**
   - 检查网络连接
   - 确认服务端 API 正常响应

如有其他安全相关问题，请及时联系开发团队。