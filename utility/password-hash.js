import bcrypt from 'bcrypt'

const saltRound = 10;

export async function creatingSalt(){
    try {
        let salt = await bcrypt.genSalt(saltRound);
        return salt;
    } catch (error){
        console.error(`Error: ${error}`);
    }
}

export async function passwordHash(pass, salt){
    try {
        let hash_pass = bcrypt.hash(pass, salt);
        return hash_pass;
    } catch (error){
        console.error(`Error: ${error}`);
    }
}

