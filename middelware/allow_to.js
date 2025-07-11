const allow_to = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: "You do not have permission to perform this action!",
            });
        }
        next();
    };
};
module.exports= allow_to;