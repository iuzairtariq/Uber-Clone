import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"
import blacklistTokenModel from '../models/blacklistTokenModel.js'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token, message:"Logged in successfully" })
        }
        else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // checking user already exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        //  validating email format & strong password
        if (!validator.isEmail(email))
            return res.json({ success: false, message: "Please enter a valid email" })
        if (password.length < 6) {
            return res.json({ success: false, message: "Please enter at least 6 characters" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, email, password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token, message:"Account created successfully" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        res.json({ success: true, user: req.body.userId })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.setHeader('Authorization', '');
        await blacklistTokenModel.create({ token: req.headers.authorization?.split(' ')[1] });

        res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, getUserProfile, logoutUser }