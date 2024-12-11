import sql from "../config/db.js";
import * as hash from "../utility/password-hash.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function getUser(email) {

    const user = await sql`
        SELECT *
        FROM users
        WHERE email = ${email}`
    return user;
}

export async function addUser(email, password_hash, fname, lname, phoneNumber, address, user_role){
    const user = await sql`
    INSERT INTO users 
    (email, password_hash, fname, lname, phone_number, user_address, user_role)
    VALUES
    (
    ${email}, 
    ${(await hash.passwordHash(password_hash, (await hash.creatingSalt(10))))},
    ${fname}, 
    ${lname}, 
    ${phoneNumber},
    ${address},
    ${user_role}
    )
    returning email, password_hash, fname, lname, phone_number, user_address, user_role
    `

    return user;
}

export async function authenticate(email, password){
    const user = await getUser(email);
        
    if(user[0] === undefined || user[0] === ''){
        return false;
    }

    const valid = bcrypt.compareSync(password, user[0].password_hash);
    
    if(valid === false){
        return false;
    }

    return true;
}

// <------------- Insert tested users into the database ----------------->


const users = [
    { email: 'john@example.com', password: 'pass123', fname: 'John', lname: 'Doe', phone_number: '0412345678', address: '123 Elm St, Sydney, NSW', role: 'user' },
    { email: 'jane@example.com', password: 'secret789', fname: 'Jane', lname: 'Smith', phone_number: '0498765432', address: '456 Oak St, Melbourne, VIC', role: 'user' },
    { email: 'sam@example.com', password: 'qwerty123', fname: 'Sam', lname: 'Brown', phone_number: '0401029384', address: '789 Pine St, Brisbane, QLD', role: 'admin' },
    { email: 'emma@example.com', password: 'hello321', fname: 'Emma', lname: 'Green', phone_number: '0432112345', address: '101 Maple St, Perth, WA', role: 'user' },
    { email: 'lucas@example.com', password: 'welcome45', fname: 'Lucas', lname: 'Blue', phone_number: '0422334455', address: '102 Birch St, Adelaide, SA', role: 'user' },
    { email: 'sophia@example.com', password: 'letmein11', fname: 'Sophia', lname: 'Black', phone_number: '0499123456', address: '103 Cedar St, Hobart, TAS', role: 'admin' },
    { email: 'chris@example.com', password: 'abc123def', fname: 'Chris', lname: 'White', phone_number: '0400987654', address: '104 Fir St, Darwin, NT', role: 'user' },
    { email: 'ava@example.com', password: '1234pass', fname: 'Ava', lname: 'Brown', phone_number: '0401234567', address: '105 Pine St, Canberra, ACT', role: 'user' },
    { email: 'liam@example.com', password: 'simple456', fname: 'Liam', lname: 'Gray', phone_number: '0412567890', address: '106 Spruce St, Gold Coast, QLD', role: 'admin' },
    { email: 'mia@example.com', password: '9password', fname: 'Mia', lname: 'Green', phone_number: '0411122233', address: '107 Redwood St, Sydney, NSW', role: 'user' },
];

const saltRounds = 10;

async function generateHashes() {
    for (let user of users) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // SQL insert statement for each user
        const insertStatement = await sql`
            INSERT INTO users (email, password_hash, fname, lname, phone_number, user_address, user_role)
            VALUES (${user.email}, ${hashedPassword}, ${user.fname}, ${user.lname}, ${user.phone_number}, ${user.address}, ${user.role})
            returning email, password_hash, fname, lname, phone_number, user_address, user_role
        `;
        console.log(insertStatement);
    }
}
// Please comment out the following line after running this file
// generateHashes();
