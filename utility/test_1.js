// app.js
import { creatingSalt, passwordHash } from './password-hash.js';

async function hash_password(str){
    let salt = await creatingSalt();
    let pass_hash = await passwordHash(str, salt);

    console.log(`Hash Password: ${pass_hash}`);
}

hash_password("ThanhKhietHuynh@75183");