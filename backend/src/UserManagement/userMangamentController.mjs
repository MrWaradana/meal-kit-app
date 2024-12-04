import { validationResult } from "express-validator"
import { getAllUsers, getUserByEmail, getUserById, updateUserById, deleteUserById, createUser } from "../models/users.mjs"

const create = async (req, res) => {
    const { email } = req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const exist = await getUserByEmail(email);

        if (exist) {
            return res
                .status(400)
                .json({ message: "User with the same email already exist!" });
        }

        const newUser = await createUser(req.body);

        return res.status(201).json({ message: "User created", newUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const index = async (req, res) => {
    try {
        const { page, limit, sortBy, sortOrder } = req.query;

        const result = await getAllUsers(
            {
                sortOrder: sortOrder
            }
        );

        // Set proper content type
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const update = async (req, res) => {
    const { email, name } = req.body
    try {
        const userId = parseInt(req.params.userId);
        const exist = await getUserByEmail(email)


        if (!email
            ||
            !name
        ) {
            return res
                .status(400)
                .json({ message: "Your payload body is empty!" });
        }
        if (!exist
        ) {
            return res
                .status(400)
                .json({ message: "User not found!" });
        }
        const newUpdateUser = await updateUserById(userId, req.body);



        return res.status(200).json({ message: `User ${userId} updated`, newUpdateUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const destroy = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        const exist = await getUserById(userId);

        if (!exist) {
            return res.status(400).json({
                message: "User to delete is not exist!"
            })
        }

        await deleteUserById(userId);

        return res.status(200).json({ message: `User with id ${userId} deleted` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export {
    create, index, update, destroy
}