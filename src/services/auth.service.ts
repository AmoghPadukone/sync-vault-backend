import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/client';
import { ProfileUpdateDto } from '../types/dto/auth.dto';

export const AuthService = {
    async signup(email: string, password: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        if (!email.includes('@')) {
            throw new Error('Invalid email address');
        }
        // if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        //     throw new Error('Invalid email format');
        // }
        // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) {
        //     throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        // }
        const hashed = await bcrypt.hash(password, 10);
        return prisma.user.create({ data: { email, password: hashed } });
    },

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        return token;
    },

    async logout(userId: string) {
        // Invalidate the user's session or token here
        // This could involve removing the token from a database or cache
        // For simplicity, we'll just return a success message
        return { message: 'Logged out successfully' };
    },

    async profile(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { preferences: true }, // ✅ this is correct **IF** Prisma schema is correctly generated
        });


        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },


    async updateProfile(email: string, updateData: ProfileUpdateDto) {
        const { preferences, ...userData } = updateData;
        const user = await prisma.user.update({
            where: { email },
            data: {
                ...userData,
                preferences: preferences ? {
                    update: preferences,
                } : undefined,
            },
            include: { preferences: true },
        });
        return user;
    }
};
