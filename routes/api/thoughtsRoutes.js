const express = require('express');
const router = express.Router();
const thoughtController = require('../../controllers/thoughtController');

router.get('/', thoughtController.getThoughts);
router.get('/:id', thoughtController.getThought);
router.post('/', thoughtController.addThoughts);
router.post('/:id/reactions', thoughtController.addReaction);
router.put('/:id', thoughtController.updateThought);
router.delete('/:id', thoughtController.deleteThought);
router.get('/:id/reactions', thoughtController.getReactions);
router.delete('/:thoughtId/reactions/:reactionId', thoughtController.deleteReaction);
module.exports = router;