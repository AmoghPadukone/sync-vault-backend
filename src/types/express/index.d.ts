import { User } from "@prisma/client"; // optional if you want more fields

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}
