import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"


const prisma = new PrismaClient()

const getAllUsers = async ({
    page = 1,
    limit = 10,
    sortBy = 'id',
    sortOrder = 'desc'
} = {}) => {
    try {
        const skip = (page - 1) * limit;

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                skip: skip,
                take: parseInt(limit),
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    profile: true,
                    posts: true,
                    // password is explicitly excluded
                },
                orderBy: {
                    [sortBy]: sortOrder
                }
            }),
            prisma.user.count()
        ]);

        return {
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw new Error('Failed to fetch users');
    }
};

const getUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
};

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
        // include: {
        //     Role: true,
        // },
    });
};

const registerUser = async (data) => {
    return await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            role: data.role,
            password: data.password,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            // password is explicitly excluded
        }
    });
};

const createUser = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            role: data.role,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            // password is explicitly excluded
        }
    });
};

const updateUserById = async (userId, data) => {
    return await prisma.user.update(
        {
            where: {
                id: userId,
            },
            data: {
                email: data.email,
                name: data.name,
                // password: data.password,
                roleId: data.roleId,
            }
        }
    )
}

const deleteUserById = async (userId) => {
    return await prisma.user.delete({
        where: {
            id: userId,
        }
    })
}


// Dummy user data (in a real app, this would be fetched from a database)
const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'admin1', password: 'adminpassword1', role: 'admin' },
];

export {
    users,
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    registerUser
}
