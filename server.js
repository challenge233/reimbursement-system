// 正确的 server.js
const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const express = require('express');  // 添加这一行

// 创建服务器实例
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// 启用 CORS（允许所有域名访问）
server.use(cors());
server.use(middlewares);

// 解析 JSON 请求体
server.use(jsonServer.bodyParser);

// 自定义日志中间件
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 静态文件服务 - 提供 index.html
server.use(express.static(__dirname));

// 自定义路由：根路径返回前端页面
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 使用默认的 JSON Server 路由
server.use('/records', router);

// 错误处理
server.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║      报销信息收集系统 - 后端服务已启动                    ║
╠══════════════════════════════════════════════════════════╣
║  本地地址: http://localhost:${PORT}                        ║
║  API地址:  http://localhost:${PORT}/records               ║
║  管理员密码: admin123                                     ║
╚══════════════════════════════════════════════════════════╝
  `);
});