const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.get('/:id/friends', userController.getFriends);
router.get('/:id/thoughts', userController.getThoughts);
router.post('/', userController.createUser);
router.post('/:userId/friends/:friendId',userController.addFriend);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete('/:userId/friends/:friendId',userController.deleteFriend);

module.exports = router;