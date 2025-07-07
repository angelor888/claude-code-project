// index.js - Main entry point for Jobber Autonomous Agent
require('dotenv').config();
const { JobberAgent } = require('./agent/JobberAgent');
const { WebhookServer } = require('./server/WebhookServer');
const { logger } = require('./utils/logger');
const { validateEnvironment } = require('./utils/validation');

// ASCII Art Banner
const banner = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🤖 JOBBER AUTONOMOUS AGENT v2.0 🤖                   ║
║                                                              ║
║  Intelligent • Autonomous • Self-Learning • Multi-User       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

async function main() {
    console.log(banner);
    
    try {
        // Validate environment variables
        validateEnvironment();
        
        // Initialize the agent
        logger.info('Initializing Jobber Autonomous Agent...');
        const agent = new JobberAgent({
            name: 'DuetRight-AI',
            version: '2.0.0',
            features: {
                autonomous: true,
                learning: true,
                proactive: true,
                multiUser: true
            }
        });
        
        // Initialize the webhook server
        const server = new WebhookServer(agent);
        
        // Start the agent
        await agent.initialize();
        
        // Start the server
        const port = process.env.PORT || 3000;
        await server.start(port);
        
        logger.info(`🚀 Agent operational on port ${port}`);
        logger.info(`🌐 Webhook endpoint: ${process.env.BASE_URL || 'http://localhost:' + port}/webhooks/jobber`);
        
        // Graceful shutdown handlers
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received, shutting down gracefully...');
            await agent.shutdown();
            await server.stop();
            process.exit(0);
        });
        
        process.on('SIGINT', async () => {
            logger.info('SIGINT received, shutting down gracefully...');
            await agent.shutdown();
            await server.stop();
            process.exit(0);
        });
        
    } catch (error) {
        logger.error('Fatal error during initialization:', error);
        process.exit(1);
    }
}

// Start the application
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
