const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { validateUser } = require("../middlewares/SchemaMiddleware");
const { sign } = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;


const createAccount = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user with the hashed password
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ msg: 'Create Account successfully', user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};


const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong username and password combination" });
        }

        const accessToken = sign(
            { email: user.email, id: user.id, role: user.role },
            secretKey,
            { expiresIn: '2h' }
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: false,  // Set to false to allow client-side access
            secure: false,    // Set to true if using HTTPS
            sameSite: 'Lax',  // Adjust as needed
            maxAge: 7200000 // 2 hours
        });

        res.json({
            message: 'Logged in successfully',
            user: {
                email: user.email,
                id: user.id,
                role: user.role
            },
            token: accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};


const auth = (req, res) => {
    res.json({
        msg: 'Authenticated',
        user: {
            email: req.user.email,
            id: req.user.id,
            role: req.user.role
        }
    });
};


module.exports = {
    createAccount: [validateUser, createAccount],
    loginAccount,
    auth
};