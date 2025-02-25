import captainModel from '../models/captainModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import blacklistTokenModel from '../models/blacklistTokenModel.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}


// Register captain function
const registerCaptain = async (req, res) => {
    const { name, email, password, socketId, status, vehicle, location } = req.body;

    try {
        // Checking if the captain already exists
        const exists = await captainModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Captain already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Please enter at least 6 characters" });
        }

        // Hashing captain's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating a new captain
        const newCaptain = new captainModel({
            name,
            email,
            password: hashedPassword,
            socketId,
            status,
            vehicle,
            location
        });

        // Saving to the database
        const captain = await newCaptain.save();

        // Creating token
        const token = createToken(captain._id);

        res.json({ success: true, token, message: "Account created successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Login captain function
const loginCaptain = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Finding the captain by email
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.json({ success: false, message: "Captain not found" });
        }

        // Comparing the password
        const isMatch = await bcrypt.compare(password, captain.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Creating token
        const token = createToken(captain._id);

        // Responding with success
        res.json({ success: true, token, message: "Logged in successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get captain profile function
const getCaptainProfile = async (req, res) => {
    const captainId = req.body.captainId;

    try {
        // Fetch captain details from the database
        const captain = await captainModel.findById(captainId).select('name email status vehicle location');

        if (!captain) {
            return res.json({ success: false, message: "Captain not found" });
        }

        // Respond with captain details
        res.json({
            success: true,
            captain: {
                name: captain.name,
                email: captain.email,
                status: captain.status,
                vehicle: captain.vehicle,
                location: captain.location
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Captian logout function
const logoutCaptain = async (req, res) => {
    try {
        res.setHeader('Authorization', '');
        await blacklistTokenModel.create({ token: req.headers.authorization?.split(' ')[1] });

        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain }


