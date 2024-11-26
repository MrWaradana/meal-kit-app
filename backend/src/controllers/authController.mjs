import { getAllUsers, getUserByEmail, createUser } from "../models/users.mjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await getUserByEmail(email);

        if (user) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await createUser({
            name,
            email,
            role,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User created", data: {
                name,
                email,
                role,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const accessToken = jwt.sign(
            {
                user: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            userId: user.id,
            name: user.name,
            email: user.email

        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const logout = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(204).json({ message: "Invalid token" });
        }
        res.clearCookie("accessToken");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export {
    register,
    login,
    logout
}