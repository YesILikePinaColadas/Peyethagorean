export type ErrorObject = {
    [key: string]: string | ErrorObject;
};

export type ErrorResponse = {
    message: string;
    errors?: ErrorObject;
};