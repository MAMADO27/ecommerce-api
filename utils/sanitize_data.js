exports.sanitize_data= function (user){

    return{
        id: user._id,
        name: user.name,
        email: user.email,

    }
}