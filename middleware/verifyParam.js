const db = require('../model/db')

const verifyParam = async (req, res, next) => {
    const current_user = parseInt(req.user.userId)
    const user_id = parseInt(req.params.user_id)
    console.log(`current_user: ${current_user}, business_id: ${user_id}`);
    if (current_user !== user_id) {
        return res.status(400).json({ message: 'access denied: your id and param does not match' })
    }
    next()
}

module.exports = verifyParam