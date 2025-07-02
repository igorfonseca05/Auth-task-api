const request = require('supertest')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const app = require('../app')

const id = new mongoose.Types.ObjectId()

const user = {
    _id: id,
    name: 'Caio',
    email: 'Caio@gmail.com',
    password: '123456789',
    tokens: [
        { token: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }) },
    ]
}

const user2 = {
    _id: id,
    name: 'Caio',
    email: 'Caio@gmail.com',

}

beforeEach(async () => {
    await userModel.deleteMany({})
    await (new userModel(user)).save()
})



describe('Testing Auth API', () => {

    test('it should create a user', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                name: "Igor",
                email: "igorfon@gmail.com",
                password: "123456789"
            })
        expect(res.statusCode).toBe(201)
        expect(typeof res.body.user._id).toBe('string')
    })

    test('it should not create a user, lacking a field', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                name: "",
                email: "igorfon@gmail.com",
                password: "123456789"
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not create a user, email has already used', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Caio',
                email: 'Caio@gmail.com',
                password: '123456789'
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not create a user, short password', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Aline',
                email: 'AlineAntunes@gmail.com',
                password: '123'
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not create a user, invalid email', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Aline',
                email: 'AlineAntunes%gmail.com',
                password: '123456789'
            })
        expect(res.statusCode).toBe(404)
    })


    test('it should sign in for a user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio@gmail.com',
                password: '123456789'
            })
        expect(res.statusCode).toBe(200)
        expect(typeof res.body.user._id).toBe('string')
    })

    test('it should not sign in for a user, there is no email', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'Carla@gmail.com',
                password: '1234567'
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not sign in for a user, incorrect password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio@gmail.com',
                password: '1234567'
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not sign in for a user, invalid email', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio&&%gmail.com',
                password: '1234567'
            })
        expect(res.statusCode).toBe(404)
    })

    test('it should not sign in for a user, empty email fiel', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: '',
                password: '1234567'
            })
        expect(res.statusCode).toBe(404)
    })


    // Private Routes

    test('it should get user profile', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
        expect(res.statusCode).toBe(200)
    })

    test('it should not get user profile, invalid token', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer e2JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU1NDQ0NzIxYjYzZWI2ODFmYmQ2MiIsImlhdCI6MTc1MTQ3MTE3MiwiZXhwIjoxNzUyMDc1OTcyfQ.O8U9M0wJGpMpibjE5GvSd55D9soBhZLPGiaVo9LpJFI`)
            .send()
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('invalid token')

        console.log(res.body)
    })

    test('should not access profile without token', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .send()
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('Unauthorized')
    })


    test('it should logout user', async () => {
        const res = await request(app)
            .post('/api/users/logout')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
        expect(res.statusCode).toBe(200)
    })

    test('it should not logout user', async () => {
        const res = await request(app)
            .post('/api/users/logout')
            .send()
        expect(res.statusCode).toBe(401)
    })

    test('it should logout user from all divices', async () => {
        const res = await request(app)
            .post('/api/users/logoutAll')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
        expect(res.statusCode).toBe(200)
    })

    test('it should verify tokens', async () => {
        const userData = await userModel.findOne({ email: user.email })
        expect(userData.tokens.length).toBeGreaterThan(0)
    })

    test('it should remove lastToken', async () => {
        const userData = await userModel.findOne({ email: user.email })

        const lastToken = userData.tokens[0].token

        await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio@gmail.com',
                password: '123456789'
            })

        await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio@gmail.com',
                password: '123456789'
            })

        await request(app)
            .post('/api/users/login')
            .send({
                email: 'Caio@gmail.com',
                password: '123456789'
            })


        const updatedUser = await userModel.findOne({ email: user.email })
        const isEqual = updatedUser.tokens.some(t => t.token === lastToken)

        expect(isEqual).toBe(false)
    })

    test('it should delete user profile', async () => {
        const res = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
        expect(res.statusCode).toBe(200)
    })

})


afterAll(async () => {
    await mongoose.connection.close()
})