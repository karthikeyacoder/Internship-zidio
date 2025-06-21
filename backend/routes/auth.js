import express from 'express'
import { body } from 'express-validator'
import { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
]

// Routes
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.post('/logout', auth, logout)
router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfileValidation, validate, updateProfile)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router