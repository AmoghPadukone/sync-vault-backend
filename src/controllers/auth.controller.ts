import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.signup(email, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await AuthService.login(email, password);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: (err as Error).message });
    }
};

// GET /me
export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.user as { email: string }; // assuming you attach user in auth middleware
        if (!email) {
            throw new Error('Unauthorized');
        }
        const profile = await AuthService.profile(email);
        res.json(profile);
    } catch (err) {
        res.status(401).json({ message: (err as Error).message });
    }
};


// PATCH /profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.user as { email: string };
        if (!email) {
            throw new Error('Unauthorized');
        }
        const updateData = req.body; // already validated using ProfileUpdateSchema
        const updatedProfile = await AuthService.updateProfile(email, updateData);
        res.json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};