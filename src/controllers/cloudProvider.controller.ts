import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { CloudProviderService } from '../services/cloudProvider.service';
import { ConnectProviderSchema, UpdateProviderSchema } from '../types/dto/cloudProvider.dto';

export const getProviders = async (req: Request, res: Response) => {
    // Simulate fetching cloud providers from a database or external service
    const providers = [
        { id: 1, name: 'AWS' },
        { id: 2, name: 'Azure' },
        { id: 3, name: 'Google Cloud' },
    ];

    res.status(200).json(providers);

}



export const connectProvider = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const parsed = ConnectProviderSchema.safeParse(req.body);
    if (!parsed.success) {
        throw createHttpError(400, 'Invalid input', { errors: parsed.error.flatten() });
    }

    await CloudProviderService.connect(userId, parsed.data);
    res.status(200).json({ message: `Connected to ${parsed.data.provider} successfully.` });
};



export const disconnectProvider = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { providerId } = req.params;

    if (!userId) throw createHttpError(401, 'Unauthorized');

    const allowed = ['aws', 'azure', 'gcp'];
    if (!allowed.includes(providerId)) {
        throw createHttpError(400, 'Invalid provider');
    }

    await CloudProviderService.disconnect(userId, providerId as 'aws' | 'azure' | 'gcp');
    res.status(200).json({ message: `Disconnected from ${providerId}` });
};




export const getConnectedProviders = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const connectedConfigs = await CloudProviderService.getFullProviderConfigs(userId);
    res.status(200).json({ providers: connectedConfigs });
};


export const updateProvider = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { providerId } = req.params;

    if (!userId) throw createHttpError(401, 'Unauthorized');

    const parsed = UpdateProviderSchema.safeParse(req.body);
    if (!parsed.success) {
        throw createHttpError(400, 'Invalid input', { errors: parsed.error.flatten() });
    }

    if (Object.keys(parsed.data).length === 0) {
        throw createHttpError(400, 'No fields to update');
    }

    const allowed = ['aws', 'gcp', 'azure'];
    if (!allowed.includes(providerId)) {
        throw createHttpError(400, 'Invalid provider');
    }

    await CloudProviderService.updateProviderConfig(userId, providerId as any, parsed.data);
    res.status(200).json({ message: `${providerId} config updated.` });
};

