import { body } from "express-validator"

const createUserValidator = [
    // Email validation
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail()
        .toLowerCase(),

    // Name validation (optional as per schema)
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Name can only contain letters and spaces'),

    // Role validation (enum validation)
    body('role')
        .optional() // Since it has a default value
        .isIn(['USER', 'ADMIN']) // Adjust based on your actual Role enum values
        .withMessage('Invalid role specified'),

    // Profile validation (if you're accepting profile data during user creation)
    body('profile')
        .optional()
        .isObject()
        .withMessage('Profile must be an object'),

    body('profile.*.bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),

    // Password validation (if you're planning to add it)
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 100 })
        .withMessage('Password must be between 8 and 100 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
        .withMessage('Password must include one lowercase letter, one uppercase letter, one number, and one special character'),

    // Password confirmation validation
    // body('confirmPassword')
    //     .notEmpty()
    //     .withMessage('Password confirmation is required')
    //     .custom((value, { req }) => {
    //         if (value !== req.body.password) {
    //             throw new Error('Passwords do not match');
    //         }
    //         return true;
    //     })
];

// Validator for updating user information
const updateUserValidator = [
    // Email validation (optional for updates)
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail()
        .toLowerCase(),

    // Name validation
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Name can only contain letters and spaces'),

    // Role validation
    body('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Invalid role specified'),

    // Profile validation
];

// Validator for checking if user exists
const userExistsValidator = [
    body('email')
        .custom(async (email) => {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new Error('Email already in use');
            }
            return true;
        })
];

export {
    createUserValidator,
    updateUserValidator,
    userExistsValidator
};