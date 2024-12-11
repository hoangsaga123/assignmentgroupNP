import jwt from 'jsonwebtoken';

export default function authorise(role){
    return async function(req, res, next){
        const token = req.cookies.token;

        if(!token){
            return res.redirect(302, '/login-form');
        }

        try{
            const user = jwt.verify(token, process.env.JWT_SECRET);

            if(role.includes(user.user_role)){
                req.user = user;
                return next();
            } else {
                return res.redirect(302, 'login-form')
            }

        } catch(err){
            console.error(`Token invalid or expired: ${err.message}`);
            res.clearCookie('token');
        }
        return res.redirect(302, '/login-form');
    };
}
