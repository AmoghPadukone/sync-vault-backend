import { Request, Response } from 'express';
import { CloudProviderService } from '../services/cloudProvider.service';
import { ConnectProviderSchema, UpdateProviderSchema } from '../types/dto/cloudProvider.dto';

export const getProviders = async (req: Request, res: Response) => {
    try {
        // Simulate fetching cloud providers from a database or external service
        const providers = [
            { id: 1, name: 'AWS' },
            { id: 2, name: 'Azure' },
            { id: 3, name: 'Google Cloud' },
        ];

        res.status(200).json(providers);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}



export const connectProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const parsed = ConnectProviderSchema.parse(req.body);

        await CloudProviderService.connect(userId, parsed);
        res.status(200).json({ message: `Connected to ${parsed.provider} successfully.` });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid input';
        res.status(400).json({ message });
    }
};

export const disconnectProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { providerId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const allowed = ['aws', 'azure', 'gcp'];
        if (!allowed.includes(providerId)) {
            res.status(400).json({ message: 'Invalid provider' });
            return;
        }

        await CloudProviderService.disconnect(userId, providerId as 'aws' | 'azure' | 'gcp');
        res.status(200).json({ message: `Disconnected from ${providerId}` });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        res.status(500).json({ message });
    }
};

export const getConnectedProviders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error('Unauthorized');
        const connectedConfigs = await CloudProviderService.getFullProviderConfigs(userId);
        res.status(200).json({ providers: connectedConfigs });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { providerId } = req.params;

        if (!userId) throw new Error('Unauthorized');

        const parsed = UpdateProviderSchema.parse(req.body);
        if (Object.keys(parsed).length === 0) {

            throw new Error('No fields to update');
        }

        const allowed = ['aws', 'gcp', 'azure'];
        if (!allowed.includes(providerId)) {
            throw new Error('Invalid provider');
        }

        await CloudProviderService.updateProviderConfig(userId, providerId as any, parsed);
        res.status(200).json({ message: `${providerId} config updated.` });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update';
        res.status(400).json({ message });
    }
};

