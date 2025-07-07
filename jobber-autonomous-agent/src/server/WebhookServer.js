// WebhookServer.js - Production-ready webhook server with enhanced security and monitoring
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

class WebhookServer {
    constructor(agent) {
        this.agent = agent;
        this.app = express();
        this.metrics = {
            totalRequests: 0,
            successfulWebhooks: 0,
            failedWebhooks: 0,
            averageResponseTime: 0,
            responseTimes: []
        };
        
        this.setupMiddleware();
        this.setupRoutes();
    }
    
    setupMiddleware() {
        // Security headers
        this.app.use(helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }));
        
        // CORS configuration
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
            credentials: true
        }));
        
        // Request ID and timing
        this.app.use((req, res, next) => {
            req.id = crypto.randomUUID();
            req.startTime = Date.now();
            this.metrics.totalRequests++;
            
            // Log response time
            res.on('finish', () => {
                const duration = Date.now() - req.startTime;
                this.updateResponseMetrics(duration);
                
                console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
            });
            
            next();
        });
        
        // Rate limiting
        const limiter = rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
            message: 'Too many requests, please try again later.',
            standardHeaders: true,
            legacyHeaders: false
        });
        
        this.app.use('/webhooks', limiter);
        
        // Body parsing for webhooks (raw body needed for signature)
        this.app.use('/webhooks/jobber', express.raw({ type: 'application/json', limit: '10mb' }));
        this.app.use(express.json({ limit: '10mb' }));
    }
    
    setupRoutes() {
        // Main webhook endpoint with signature validation
        this.app.post('/webhooks/jobber', this.validateWebhookSignature.bind(this), async (req, res) => {
            const requestId = req.id;
            
            try {
                // Parse the validated webhook
                const webhook = JSON.parse(req.body.toString());
                
                // Quick response (Jobber requires < 1s)
                res.status(200).json({
                    success: true,
                    requestId,
                    timestamp: new Date().toISOString()
                });
                
                // Process asynchronously
                setImmediate(() => {
                    this.processWebhook(webhook, requestId);
                });
                
                this.metrics.successfulWebhooks++;
                
            } catch (error) {
                console.error(`[${requestId}] Webhook processing error:`, error);
                this.metrics.failedWebhooks++;
                
                res.status(400).json({
                    error: 'Invalid webhook payload',
                    requestId
                });
            }
        });
        
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            const health = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                metrics: this.metrics,
                agent: {
                    status: this.agent?.status || 'unknown',
                    version: '2.0.0'
                }
            };
            
            res.json(health);
        });
        
        // Status dashboard
        this.app.get('/status', (req, res) => {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Jobber Agent Status</title>
                    <meta http-equiv="refresh" content="30">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            margin: 0;
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .container {
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        h1 {
                            color: #333;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .status-card {
                            background: white;
                            border-radius: 8px;
                            padding: 20px;
                            margin-bottom: 20px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .metrics {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                            gap: 20px;
                        }
                        .metric {
                            text-align: center;
                        }
                        .metric-value {
                            font-size: 2em;
                            font-weight: bold;
                            color: #007bff;
                        }
                        .metric-label {
                            color: #666;
                            margin-top: 5px;
                        }
                        .healthy { color: #28a745; }
                        .warning { color: #ffc107; }
                        .error { color: #dc3545; }
                        .log-entry {
                            font-family: monospace;
                            font-size: 0.9em;
                            padding: 5px;
                            background: #f8f9fa;
                            margin: 2px 0;
                            border-radius: 3px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>
                            <span>🤖</span>
                            Jobber Autonomous Agent
                            <span class="healthy">● OPERATIONAL</span>
                        </h1>
                        
                        <div class="status-card">
                            <h2>System Status</h2>
                            <p>Uptime: ${hours}h ${minutes}m</p>
                            <p>Version: 2.0.0</p>
                            <p>Multi-User Support: <span class="healthy">✓ ENABLED</span></p>
                        </div>
                        
                        <div class="status-card">
                            <h2>Webhook Metrics</h2>
                            <div class="metrics">
                                <div class="metric">
                                    <div class="metric-value">${this.metrics.totalRequests}</div>
                                    <div class="metric-label">Total Requests</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${this.metrics.successfulWebhooks}</div>
                                    <div class="metric-label">Successful Webhooks</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${this.metrics.failedWebhooks}</div>
                                    <div class="metric-label">Failed Webhooks</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${this.metrics.averageResponseTime.toFixed(2)}ms</div>
                                    <div class="metric-label">Avg Response Time</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="status-card">
                            <h2>Recent Activity</h2>
                            <div id="activity">
                                <p>Monitoring webhook activity...</p>
                            </div>
                        </div>
                        
                        <p style="text-align: center; color: #666;">
                            Auto-refreshes every 30 seconds | 
                            <a href="/health">Health Check</a> | 
                            <a href="https://github.com/angelor888/jobber-autonomous-agent">Documentation</a>
                        </p>
                    </div>
                </body>
                </html>
            `);
        });
        
        // Test endpoint (only in development)
        if (process.env.NODE_ENV !== 'production') {
            this.app.post('/test/webhook', (req, res) => {
                const testPayload = {
                    data: {
                        webHookEvent: {
                            topic: 'JOB_CREATE',
                            appId: 'test-app',
                            accountId: 'test-account',
                            itemId: 'test-' + Date.now(),
                            occurredAt: new Date().toISOString()
                        }
                    }
                };
                
                this.processWebhook(testPayload, 'test-' + req.id);
                res.json({ success: true, payload: testPayload });
            });
        }
        
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found',
                path: req.path,
                timestamp: new Date().toISOString()
            });
        });
        
        // Error handler
        this.app.use((err, req, res, next) => {
            console.error('Unhandled error:', err);
            res.status(500).json({
                error: 'Internal Server Error',
                requestId: req.id,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    validateWebhookSignature(req, res, next) {
        const signature = req.headers['x-jobber-hmac-sha256'];
        
        if (!signature) {
            console.warn('Webhook received without signature');
            return res.status(401).json({ error: 'Missing signature' });
        }
        
        const secret = process.env.JOBBER_CLIENT_SECRET;
        if (!secret) {
            console.error('JOBBER_CLIENT_SECRET not configured!');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        try {
            // Calculate expected signature
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(req.body);
            const calculatedSignature = hmac.digest('base64');
            
            // Timing-safe comparison
            const signatureValid = crypto.timingSafeEqual(
                Buffer.from(calculatedSignature),
                Buffer.from(signature)
            );
            
            if (!signatureValid) {
                console.warn('Invalid webhook signature received');
                return res.status(401).json({ error: 'Invalid signature' });
            }
            
            // Signature valid
            next();
            
        } catch (error) {
            console.error('Signature validation error:', error);
            return res.status(500).json({ error: 'Validation error' });
        }
    }
    
    async processWebhook(webhook, requestId) {
        try {
            console.log(`[${requestId}] Processing webhook:`, {
                topic: webhook.data?.webHookEvent?.topic,
                itemId: webhook.data?.webHookEvent?.itemId,
                accountId: webhook.data?.webHookEvent?.accountId
            });
            
            // Emit to agent for processing
            if (this.agent) {
                this.agent.emit('webhook:received', {
                    ...webhook,
                    requestId,
                    receivedAt: new Date()
                });
            } else {
                console.warn('Agent not initialized, webhook not processed');
            }
            
        } catch (error) {
            console.error(`[${requestId}] Error processing webhook:`, error);
        }
    }
    
    updateResponseMetrics(duration) {
        this.metrics.responseTimes.push(duration);
        
        // Keep only last 1000 response times
        if (this.metrics.responseTimes.length > 1000) {
            this.metrics.responseTimes = this.metrics.responseTimes.slice(-1000);
        }
        
        // Calculate average
        const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0);
        this.metrics.averageResponseTime = sum / this.metrics.responseTimes.length;
    }
    
    async start(port = 3000) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, (err) => {
                if (err) {
                    console.error('Failed to start server:', err);
                    reject(err);
                } else {
                    console.log(`✅ Webhook server listening on port ${port}`);
                    console.log(`📍 Webhook endpoint: ${process.env.BASE_URL || 'http://localhost:' + port}/webhooks/jobber`);
                    resolve();
                }
            });
        });
    }
    
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('Webhook server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = { WebhookServer };
