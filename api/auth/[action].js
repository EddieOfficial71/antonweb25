const { loadUsers, saveUsers, generateToken, getUsers, setUsers } = require('./lib');

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/api/auth/signup') {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        loadUsers();
        let users = getUsers();
        
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = {
            username,
            password,
            email,
            isPremium: false,
            createdAt: new Date()
        };

        users.push(newUser);
        setUsers(users);
        saveUsers();

        const token = generateToken(username);
        return res.status(200).json({ token, username, isPremium: false });
    }

    if (req.method === 'POST' && req.url === '/api/auth/login') {
        const { username, password } = req.body;

        loadUsers();
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(username);
        return res.status(200).json({ token, username, isPremium: user.isPremium });
    }

    res.status(404).json({ message: 'Not found' });
};
