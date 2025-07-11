const api_error = require('../utils/api_error');
const global_error=(err, req, res, next) => {
  err.status_code = err.status_code || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    send_error_for_dev(err, res);
  }else {
    // In production, we don't want to expose the stack trace or error details
    if (err.name === 'json web token error') {
      err.status_code = 400;
      err.message = Object.values(err.errors).map(el => el.message).join('. ');
    }
    send_error_for_prod(err, res);
  }
}



const send_error_for_dev=(err, res)=>{ 
  return res.status(err.status_code).json({
    status: err.status,
    error: err,
    message: err.message ,
    stack:err.stack,

  });
}

const send_error_for_prod=(err, res)=>{ 
  return res.status(err.status_code).json({
    status: err.status,
    message: err.message ,

  });
}










module.exports = global_error;


