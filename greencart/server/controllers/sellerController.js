import jwt from 'jsonwebtoken';

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify credentials
        if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Create token
        const token = jwt.sign(
            { email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ 
            success: true, 
            message: "Logged in successfully" 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const isSellerAuth = async (req, res) => {
    try {
        // Just verify the token is valid
        const token = req.cookies.sellerToken;
        if (!token) {
            return res.status(401).json({ success: false });
        }
        
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: "Not authenticated" 
        });
    }
}

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.json({ 
            success: true, 
            message: "Logged out successfully" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}