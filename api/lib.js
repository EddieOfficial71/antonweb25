const fs = require('fs');
const path = require('path');

// File paths (for Vercel, these will use /tmp for temporary storage)
const getDataPath = () => process.env.VERCEL ? '/tmp' : process.cwd();
const usersFile = path.join(getDataPath(), 'users.json');
const messagesFile = path.join(getDataPath(), 'messages.json');
const paymentsFile = path.join(getDataPath(), 'payments.json');
const broadcastsFile = path.join(getDataPath(), 'broadcasts.json');

let users = [];
let messages = [];
let paymentNotifications = [];
let broadcasts = [];

// Load users from file
function loadUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            users = JSON.parse(data);
        }
    } catch (error) {
        console.log('No users file found, starting fresh');
        users = [];
    }
    return users;
}

// Save users to file
function saveUsers() {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Error saving users', e);
    }
}

// Load messages from file
function loadMessages() {
    try {
        if (fs.existsSync(messagesFile)) {
            const data = fs.readFileSync(messagesFile, 'utf8');
            messages = JSON.parse(data);
        }
    } catch (error) {
        console.log('No messages file found, starting fresh');
        messages = [];
    }
    return messages;
}

// Save messages to file
function saveMessages() {
    try {
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    } catch (e) {
        console.error('Error saving messages', e);
    }
}

// Load payments from file
function loadPayments() {
    try {
        if (fs.existsSync(paymentsFile)) {
            const data = fs.readFileSync(paymentsFile, 'utf8');
            paymentNotifications = JSON.parse(data);
        }
    } catch (error) {
        console.log('No payments file found, starting fresh');
        paymentNotifications = [];
    }
    return paymentNotifications;
}

// Save payments to file
function savePayments() {
    try {
        fs.writeFileSync(paymentsFile, JSON.stringify(paymentNotifications, null, 2));
    } catch (e) {
        console.error('Error saving payments', e);
    }
}

// Load broadcasts from file
function loadBroadcasts() {
    try {
        if (fs.existsSync(broadcastsFile)) {
            const data = fs.readFileSync(broadcastsFile, 'utf8');
            broadcasts = JSON.parse(data);
        }
    } catch (error) {
        console.log('No broadcasts file found, starting fresh');
        broadcasts = [];
    }
    return broadcasts;
}

// Save broadcasts to file
function saveBroadcasts() {
    try {
        fs.writeFileSync(broadcastsFile, JSON.stringify(broadcasts, null, 2));
    } catch (e) {
        console.error('Error saving broadcasts', e);
    }
}

// Token functions
function generateToken(username) {
    return Buffer.from(username + ':' + Date.now()).toString('base64');
}

function verifyToken(token) {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const username = decoded.split(':')[0];
        return username;
    } catch {
        return null;
    }
}

module.exports = {
    loadUsers,
    saveUsers,
    loadMessages,
    saveMessages,
    loadPayments,
    savePayments,
    loadBroadcasts,
    saveBroadcasts,
    generateToken,
    verifyToken,
    getUsers: () => users,
    getMessages: () => messages,
    getPayments: () => paymentNotifications,
    getBroadcasts: () => broadcasts,
    setUsers: (u) => { users = u; },
    setMessages: (m) => { messages = m; },
    setPayments: (p) => { paymentNotifications = p; },
    setBroadcasts: (b) => { broadcasts = b; }
};
