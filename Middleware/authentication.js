const jwt = require('jsonwebtoken');

const is_login = async (req, res, next) => {
    try {
        const token = req.cookies.myjwt;

        if (!token) {
            return res.redirect('/login');
        } else {
            const jwt_token = await jwt.verify(token, 'mysecretkeyfortoken');
            if (!jwt_token) {
                return res.redirect('/login');
            }

            // Check the user's role from the token
            const userRole = jwt_token.role_as;

            // Check if the user's role allows access to the current route
            

            if (userRole === '1' && req.baseUrl.includes('/employer')) {
                // Only allow employers to access employer-related routes
                req.decodetoken = jwt_token;
                return next();
            } else if (userRole === '2' && req.baseUrl.includes('/candidates')) {
                // Only allow candidates to access candidate-related routes
                req.decodetoken = jwt_token;
                return next();
            } else {
                // Redirect or deny access for other roles
                return res.redirect('/login');
            }
        }
    } catch (error) {
        console.log(`Error in auth middleware: ${error}`);
    }
};

module.exports = {
    is_login
};
