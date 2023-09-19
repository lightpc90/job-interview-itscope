const db = require('../model/db')

const isVerifiedBusiness = async (req, res, next) => {
    const { userId } = req.user
    const current_user = await db.oneOrNone("SELECT * FROM users WHERE id=$1", [userId])
    if (current_user.role !== "Business" && current_user.businessName === null) {
        return res.status(401).json({ message: 'unauthorized: your role must be "Business" and your business name must be set ' })
    }
    // check passed
    next()
}

module.exports = isVerifiedBusiness