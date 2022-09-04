//["ADMIN,"USER"]
exports.checkRole = (arrayRoles) => {

    return (req, res, next) => {

        const { role } = req.session.currentUser
        if (arrayRoles.includes(role)) {
            return next()
        } else {
            return res.status(403).send("you don't have permission for this action")
        }


    }
}
