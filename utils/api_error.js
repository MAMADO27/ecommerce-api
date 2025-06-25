// desc this class ia responsible about handling errors
class api_error extends Error {
    constructor(message, status_code) {
        super(message);
        this.status_code = status_code; // لازم تفضل رقم
        this.status = `${status_code}`.startsWith('4') ? 'fail' : 'error'; // هنا فقط النص
        this.isOperational = true;
    }
}
module.exports = api_error;