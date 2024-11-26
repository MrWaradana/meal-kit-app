import express from "express";
import { register, login, logout } from "../controllers/authController.mjs";
import {
    create,
    index,
    update,
    destroy,
} from "../controllers/userMangamentController.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";
import { verifyAdmin } from "../middlewares/verifyAdmin.mjs";
import { createUserValidator, updateUserValidator } from "../middlewares/userValidator.mjs";
import { validationResult } from "express-validator";

const router = express.Router();

// Simple validation error handler
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/*
===================================================================================
================================= ROUTES ==========================================
===================================================================================
*/

// Health Check
router.get("/", (req, res) => {
    res.status(200).json({ message: "User Management App" });
});

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.delete("/auth/logout", verifyToken, logout);

// User Management Routes
router.post("/user", verifyAdmin, createUserValidator, validateRequest, create);
router.get("/users", verifyAdmin, index);
router.put("/user/:userId", verifyAdmin, updateUserValidator, validateRequest, update);
router.delete("/user/:userId", verifyAdmin, destroy);

export default router;