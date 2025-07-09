import config from "../config/config.js";

const errorHandler = (err, req, res, next) => {

            if (res.headerSent) {
                        return next(err)
            }
            const statusCode = err.statusCode || 500;
            const message = err.message || "Something went wrong";

            const errorResponse = {
                        success: false,
                        message
            }

            if (config.NODE_ENV === "development") {
                        errorResponse.stack = err.stack;
            }


            res.status(statusCode).json(errorResponse);
}

export default errorHandler;