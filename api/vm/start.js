const { verifyToken } = require('../../lib');

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    const username = verifyToken(token);

    if (!username) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // VM operations only work on localhost
    if (process.env.VERCEL) {
        return res.status(503).json({ message: 'VM control not available on cloud deployment. Use local server.' });
    }

    res.status(503).json({ message: 'VM control not available' });
};
