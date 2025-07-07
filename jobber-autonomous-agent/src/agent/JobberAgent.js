// JobberAgent.js - Core autonomous agent with optimizations
const EventEmitter = require('events');
const axios = require('axios');

class JobberAgent extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.status = 'initializing';
        this.stats = {
            webhooksProcessed: 0,
            errors: 0,
            startTime: Date.now()
        };
        
        // Webhook processing queue
        this.processingQueue = [];
        this.isProcessing = false;
        
        console.log('🤖 JobberAgent initialized:', config);
    }
    
    async initialize() {
        try {
            console.log('Initializing Jobber Agent...');
            
            // Set up event handlers
            this.setupEventHandlers();
            
            // Verify configuration
            this.validateConfig();
            
            this.status = 'operational';
            console.log('✅ Agent initialization complete');
            
        } catch (error) {
            console.error('❌ Agent initialization failed:', error);
            this.status = 'error';
            throw error;
        }
    }
    
    validateConfig() {
        const required = ['JOBBER_CLIENT_ID', 'JOBBER_CLIENT_SECRET', 'BASE_URL'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        
        console.log('✅ Configuration validated');
    }
    
    setupEventHandlers() {
        // Handle incoming webhooks
        this.on('webhook:received', async (data) => {
            // Add to queue for processing
            this.processingQueue.push(data);
            
            // Start processing if not already running
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
        
        // Handle errors
        this.on('error', (error) => {
            console.error('Agent error:', error);
            this.stats.errors++;
        });
    }
    
    async processQueue() {
        if (this.processingQueue.length === 0) {
            this.isProcessing = false;
            return;
        }
        
        this.isProcessing = true;
        const webhook = this.processingQueue.shift();
        
        try {
            await this.processWebhook(webhook);
        } catch (error) {
            console.error('Error processing webhook:', error);
            this.stats.errors++;
        }
        
        // Process next item
        setImmediate(() => this.processQueue());
    }
    
    async processWebhook(webhookData) {
        const { data, requestId, receivedAt } = webhookData;
        const event = data?.webHookEvent;
        
        if (!event) {
            console.warn(`[${requestId}] Invalid webhook structure`);
            return;
        }
        
        const { topic, itemId, accountId, occurredAt } = event;
        
        console.log(`[${requestId}] Processing ${topic} for item ${itemId}`);
        this.stats.webhooksProcessed++;
        
        try {
            // Process based on event type
            switch (topic) {
                case 'JOB_CREATE':
                    await this.handleJobCreate(itemId, accountId, requestId);
                    break;
                    
                case 'JOB_UPDATE':
                    await this.handleJobUpdate(itemId, accountId, requestId);
                    break;
                    
                case 'CLIENT_CREATE':
                    await this.handleClientCreate(itemId, accountId, requestId);
                    break;
                    
                case 'QUOTE_CREATE':
                    await this.handleQuoteCreate(itemId, accountId, requestId);
                    break;
                    
                default:
                    console.log(`[${requestId}] Unhandled event type: ${topic}`);
            }
            
            // Log processing time
            const processingTime = Date.now() - new Date(receivedAt).getTime();
            console.log(`[${requestId}] Processed in ${processingTime}ms`);
            
        } catch (error) {
            console.error(`[${requestId}] Error processing ${topic}:`, error.message);
            this.emit('error', error);
        }
    }
    
    async handleJobCreate(jobId, accountId, requestId) {
        console.log(`[${requestId}] 🆕 New job created: ${jobId}`);
        
        // In production, fetch job details from Jobber API
        // For now, send notification
        await this.sendNotification({
            type: 'job_created',
            jobId,
            accountId,
            message: `New job created: ${jobId}`
        });
    }
    
    async handleJobUpdate(jobId, accountId, requestId) {
        console.log(`[${requestId}] 📝 Job updated: ${jobId}`);
        
        await this.sendNotification({
            type: 'job_updated',
            jobId,
            accountId,
            message: `Job updated: ${jobId}`
        });
    }
    
    async handleClientCreate(clientId, accountId, requestId) {
        console.log(`[${requestId}] 👤 New client created: ${clientId}`);
        
        await this.sendNotification({
            type: 'client_created',
            clientId,
            accountId,
            message: `New client created: ${clientId}`
        });
    }
    
    async handleQuoteCreate(quoteId, accountId, requestId) {
        console.log(`[${requestId}] 📋 New quote created: ${quoteId}`);
        
        await this.sendNotification({
            type: 'quote_created',
            quoteId,
            accountId,
            message: `New quote created: ${quoteId}`
        });
    }
    
    async sendNotification(notification) {
        // Send to Slack if configured
        if (process.env.SLACK_WEBHOOK_URL) {
            try {
                await axios.post(process.env.SLACK_WEBHOOK_URL, {
                    text: notification.message,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*${notification.message}*\n` +
                                      `Type: ${notification.type}\n` +
                                      `Account: ${notification.accountId}\n` +
                                      `Time: ${new Date().toLocaleString()}`
                            }
                        }
                    ]
                });
                
                console.log('✅ Slack notification sent');
            } catch (error) {
                console.error('❌ Failed to send Slack notification:', error.message);
            }
        } else {
            console.log('ℹ️ Slack webhook not configured');
        }
    }
    
    async shutdown() {
        console.log('Shutting down Jobber Agent...');
        this.status = 'shutting_down';
        
        // Wait for queue to empty
        while (this.processingQueue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.removeAllListeners();
        this.status = 'shutdown';
        console.log('Agent shutdown complete');
    }
    
    getStatus() {
        return {
            status: this.status,
            stats: this.stats,
            queueLength: this.processingQueue.length,
            uptime: Date.now() - this.stats.startTime,
            config: {
                multiUserEnabled: true,
                autonomous: this.config.features?.autonomous || false,
                learning: this.config.features?.learning || false
            }
        };
    }
}

module.exports = { JobberAgent };
