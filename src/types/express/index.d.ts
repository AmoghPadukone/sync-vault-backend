import { User } from "@prisma/client"; // optional if you want more fields
import { File as MulterFile } from 'multer';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
            files?: MulterFile[];
        }
    }
}
