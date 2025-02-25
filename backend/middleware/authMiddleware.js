import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import captainModel from '../models/captainModel.js';
import blacklistTokenModel from '../models/blacklistTokenModel.js';

const authenticate = async (req, res, next, userType) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.json({ message: 'Token is Blacklisted' });
    }

    try {
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decoded.id;
        req.body.userId = userId;

        // Fetch user/captain details from the database based on userType
        let user;
        if (userType === 'user') {
            user = await userModel.findById(userId).select('name email');
        } else if (userType === 'captain') {
            user = await captainModel.findById(userId).select('name email');
        }

        if (!user) {
            return res.json({ success: false, message: `${userType === 'user' ? 'User' : 'Captain'} not found` });
        }

        // Check if the request is for profile and handle it
        if (req.path === '/profile') {
            return res.json({ success: true, userId, name: user.name, email: user.email });
        }

        return next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Auth user middleware
const authUser = (req, res, next) => authenticate(req, res, next, 'user');

// Auth captain middleware
const authCaptain = (req, res, next) => authenticate(req, res, next, 'captain');

export { authUser, authCaptain };
