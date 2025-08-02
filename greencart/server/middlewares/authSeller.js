import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    try {
        const token = req.cookies.sellerToken;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authentication token provided' 
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify the email matches our seller email
        if (decoded.email !== process.env.SELLER_EMAIL) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // If everything is good, proceed
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Session expired. Please login again.' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid authentication token' 
        });
    }
};

export default authSeller;