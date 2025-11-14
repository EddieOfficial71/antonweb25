const { loadUsers, verifyToken, getUsers } = require('../lib');

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

    loadUsers();
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        username: user.username,
        isPremium: user.isPremium,
        email: user.email,
        createdAt: user.createdAt
    });
};
