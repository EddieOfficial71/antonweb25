const { loadUsers, saveUsers, verifyToken, getUsers, setUsers } = require('../lib');

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

    if (username !== 'Anton') {
        return res.status(403).json({ message: 'Access denied' });
    }

    if (req.method === 'POST') {
        const { username: targetUsername } = req.body;

        loadUsers();
        let users = getUsers();
        const user = users.find(u => u.username === targetUsername);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isPremium = false;
        setUsers(users);
        saveUsers();

        return res.status(200).json({ message: 'Premium removed' });
    }

    res.status(404).json({ message: 'Not found' });
};
