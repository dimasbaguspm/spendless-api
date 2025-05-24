import { Router } from 'express';

import { createGroup, getGroup, updateGroup, inviteUser, listGroupUsers } from '../controllers/group.controller.ts';

const router = Router();

// Group routes
router.post('/', createGroup);
router.get('/:id', getGroup);
router.patch('/:id', updateGroup);

// Group user management
router.post('/:groupId/users', inviteUser);
router.get('/:groupId/users', listGroupUsers);

export default router;
