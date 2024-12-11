/**
 * Renders the index page with the specified title.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */

import * as userUtil from "../services/userService.js";
import jwt from 'jsonwebtoken'
import { createUserFolder } from '../utility/createFolderUtil.js';


// Login controllers
export async function loginForm(req, res, next) {
    res.render('login', { title: 'Login', comp_name: 'Eco Campus Exchange', message: '' })
}

export async function login(req, res, next) {
    const { email, password } = req.body;
    if (req.method !== 'POST' || !email || !password) {
        res.clearCookie('token');
        return res.render('login', { message: '' });
    }

    try {
        const userCheck = await userUtil.authenticate(email, password);
        if (userCheck === true) {
            const [user] = await userUtil.getUser(email);
            res.cookie('token', jwt.sign({
                email: user.email,
                fname: user.fname,
                lname: user.lname,
                phone_number: user.phone_number,
                user_address: user.user_address,
                user_role: user.user_role,
            }, process.env.JWT_SECRET
            ),
                { httpOnly: true, expireIn: '2m' });
            res.redirect(302, '/home');
        } else {
            return res.render('login', {
                title: 'Login',
                comp_name: 'Eco Campus Exchange',
                message: 'Invalid email or password'
            });
        }
    } catch (err) {
        console.error(err);
    }
}

//Logout controllers
export async function logout(req, res, next) {
    res.clearCookie('token', {
        httpOnly: true, // Ensure the cookie can't be accessed by client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict' // Protect against CSRF
    }
    );
    return res.redirect('/');
}

//Register controllers
export async function registrationForm(req, res, next) {
    res.render('registration', { title: 'Register', comp_name: 'Eco Campus Exchange' })
}

export async function registration(req, res, next) {
    const {
        email,
        fname,
        lname,
        phoneNo,
        address,
        password
    } = req.body;

    try {
        if (email === await userUtil.getUser(email)) {
            res.status(400).send(`This email has already been used!!!`)
        } else {
            const user_role = 'user';
            const newUser = await userUtil.addUser(email,
                password,
                fname,
                lname,
                phoneNo,
                address,
                user_role)

            // Create a folder for the user when registered
            await createUserFolder(email);

            res.send(`Welcome ${newUser[0].fname} ${newUser[0].lname}! <a href="/login-form">Click here to login</a>`)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Internal Error!`)
    }
}

//Profile controllers
export async function displayProfile(req, res, next) {
    res.render('profile', {
        title: 'Profile',
        comp_name: 'Eco Campus Exchange',
        user: req.user
    })
}