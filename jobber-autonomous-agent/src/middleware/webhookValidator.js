// webhookValidator.js - Webhook signature validation middleware
const crypto = require('crypto');

function validateWebhook(req, res, next) {
    const signature = req.headers['x-jobber-hmac-sha256'];
    
    if (!signature) {
        console.warn('Webhook received without signature');
        return res.status(401).json({ error: 'Missing signature' });
    }
    
    const secret = process.env.JOBBER_CLIENT_SECRET;
    if (!secret) {
        console.error('JOBBER_CLIENT_SECRET not configured');
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
            console.warn('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        // Signature valid, continue
        next();
        
    } catch (error) {
        console.error('Error validating webhook signature:', error.message);
        return res.status(500).json({ error: 'Validation error' });
    }
}

module.exports = { validateWebhook };
