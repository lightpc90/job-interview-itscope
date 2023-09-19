const db = require('../model/db')

const isVerifiedBusiness = async (req, res, next) => {
    const userId  = parseInt(req.user.userId)
    const business_id = parseInt(req.params.business_id)
    console.log(`current_user: ${userId}, business_id: ${business_id}`);
    if (userId !== business_id) {
        return res.status(400).json({ message: 'access denied: your id and your business does not match' })
    }
    const user_data = await db.oneOrNone('SELECT * FROM users WHERE id=$1', [userId])
    if (user_data.role !== "Business" || user_data.firstName === null || user_data.lastName === null || user_data.businessName === null) {
        return res.status(401).json({ message: 'unauthorized: your role must be "Business" and your businessName, firstName and lastName must be set ' })
    }
    // check passed
    next()
}

module.exports = isVerifiedBusiness