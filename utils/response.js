export const sendErrorResponse = (res, code, errorMessage, e = null) => res.status(code).send({
    status: 'error',
    error: errorMessage,
    e: e?.toString(),
});

export const sendSuccessResponse = (res, code, data, message = 'Successful') => res.status(code).send({
    status: 'success',
    data,
    message,
});

// return sendErrorResponse(res, 422, 'User with that email or phone already exists');
// import {sendErrorResponse, sendSuccessResponse} from "../utils/sendResponse";