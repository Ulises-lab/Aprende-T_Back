//["ADMIN,"USER"]
exports.checkRole = (arrayRoles) => {

    return (req, res, next) => {

        const { role } = req.session.currentUser
        if (arrayRoles.includes(role)) {
            return next()
        } else {
            return res.status(403).send("No tienes los permisos necesarios")
        }


    }
}
