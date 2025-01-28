

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

declare global {
    export namespace Express {
        interface Request{
            userId? : string
        }
    }
}