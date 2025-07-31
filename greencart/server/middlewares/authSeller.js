import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;
    console.log("Seller Token: ", sellerToken);
    console.log("JWT_SECRET at verify:", process.env.JWT_SECRET);

    if (!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {

        console.log("Raw sellerToken from cookies:", req.cookies.sellerToken);
        if (!req.cookies.sellerToken) {
            return res.json({ success: false, message: "No sellerToken cookie found" });
        }
        try {
            const tokenDecode = jwt.verify(req.cookies.sellerToken, process.env.JWT_SECRET);
            console.log("Decoded token:", tokenDecode);
            // rest of your logic...
        } catch (error) {
            console.log("JWT Verify error:", error);
            res.json({ success: false, message: error.message });
        }

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default authSeller;
