require('dotenv').config({ path: '.env' })

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const argon2 = require('argon2')
const validator = require('validator')

// const UserModel = require('../models/mo')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(name) {
            if (!name || name.length <= 2) {
                throw new Error('Name should contain at least 2 characteres')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(email) {
            if (!email || !validator.isEmail(email)) {
                throw new Error('Invalid email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        validate(password) {
            if (!password) {
                throw new Error('Invalid password, it should contain at least 4 characteres')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps: true
})

// 4º step 
// To clean up the userData before sending it back
userSchema.methods.toJSON = function () {
    const user = this

    const publicUser = user.toObject();

    delete publicUser.password;
    delete publicUser.tokens;
    delete publicUser.__v

    return publicUser
}

// 2º step
userSchema.methods.generateToken = async function () {
    try {
        const user = this

        // criando token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        // Gerenciando tokens, criando sessões
        if (user.tokens.length >= 3) {
            user.tokens?.shift()
        }

        user.tokens?.push({ token })
        await user.save()

        return token
    } catch (error) {
        console.log(error)
    }
}

// 3º step 
userSchema.statics.findByCredentials = async function ({ email, password }) {
    const user = this

    const userData = await user.findOne({ email })
    if (!userData) throw new Error('user not found')

    const isPassword = await argon2.verify(userData.password, password)
    if (!isPassword) throw new Error('Invalid password')

    return userData
}



// 1º step 
userSchema.pre('save', async function (next) {
    const user = this

    if (!user.isModified("password")) return next()

    try {
        user.password = await argon2.hash(user.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 1
        })

        next()
    } catch (error) {
        next(error)
    }
})


const userModel = mongoose.model('userModel', userSchema)

module.exports = userModel