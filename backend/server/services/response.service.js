module.exports.response = (res, status, success, message, data, total_count) => {
    let send = {
        success,
        message,
        response: data,
        status,
        total_count
    }
    return res.status(status).json(send);
}