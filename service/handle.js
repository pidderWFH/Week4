
const handle ={
    handleError (res, errCode, errMsg) {

        res.status(errCode).send({
            status: false,
            message: errMsg || message
        }).end();
    },
    handleSucess (res, data){
        res.send({
            status: true,
            data
        }).end();
    }
}

module.exports = handle;