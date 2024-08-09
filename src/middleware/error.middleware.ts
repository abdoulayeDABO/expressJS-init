export class ErrorMiddleware extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err: Error, req: any, res: any, next: any) => {
  if (err instanceof ErrorMiddleware) {
      res.status(err.statusCode).json({message: err.message});
  } else {
      res.status(500).json({message: err.message});
  }
};