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

    loadUsers();
    const users = getUsers();

    if (req.method === 'GET') {
        return res.status(200).json({ users });
    }

    res.status(404).json({ message: 'Not found' });
};
