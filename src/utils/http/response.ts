class HttpResponse {
    status: boolean;
    message: string;
    data: Object | null;

    constructor(status: boolean, message: string, data: Object | null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export default HttpResponse;