import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/verifyToken';
import { isAdmin } from '../../middleware/isAdmin';
import { createTopicService } from './topic.service';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }

    const topic = await createTopicService(name, description || null, req.user.user_id);
    return res.status(201).json({ message: 'Topic created', topic });
  } catch (error: any) {
    console.error(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
