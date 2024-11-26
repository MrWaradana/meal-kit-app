import { users } from "../models/users.mjs";

// Middleware for authentication
const authenticateUser = (req, res, next) => {
    const { username, password } = req.headers;

    // Find the user with the provided credentials
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    req.user = user; // Attach the user object to the request
    next();
};

// Middleware for authorization
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Permission denied' });
    }
};

export {
    authenticateUser,
    authorizeAdmin
}