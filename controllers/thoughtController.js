const {Thought, User} = require('../models');

//Get all thoughts 
async function getThoughts(req, res){
    try{
        const thoughts = await Thought.find({});
        res.status(200).json({
            message: "Thoughts retrieved succesfully",
            data: thoughts
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error retrieving thoughts",
            error: err.message
        });
    }
}

//Get a thought by ID
async function getThought(req, res){
    try{
        const thought = await Thought.findById(req.params.id);
        if(!thought){
            return res.status(404).json({message: "Thought not found"});
        }
        res.status(200).json({
            message: "Thought found",
             thought: thought
            });
    }catch(err){
        console.error(err);
        return res.status(400).json({message: "Error retrieving thought", error: err.message});
    }
}

//Create thought
async function addThoughts(req, res){
    try{
        const user = await User.findById(req.body.userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const thought = await Thought.create({
            thoughtText: req.body.thoughtText,
            username: user.username,
            userId: user.Id
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.body.userId,
            {$push: {thoughts: thought._id} },
            {new: true}
        );
        if(!updatedUser){
            await Thought.findByIdAndDelete(thought._id);
            return res.status(500),json({message: "Failed to update user with new thought"});
        }

        res.status(201).json({
            message: "Thought created succesfully",
            thought: thought,
            user: updatedUser
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Unable to create thought", 
            error: err.message});
    }
}

//Update thought
async function updateThought(req, res){
    try{
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if(!updatedThought){
            return res.status(404).json({message: "Thought not found"});
        }
        res.status(200).json({
            message: "Thought updated succesfully",
            thought: updatedThought
            });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Unable to update thought", error: err.message});
    }

}

//Delete thought 

async function deleteThought(req, res){
    try{
        const thought = await Thought.findById(req.params.id);
        if(!thought){
            return res.status(404).json({message: "Thought not found"});
        }

        await Thought.deleteOne({_id: thought._id});
        const updatedUser = await User.findByIdAndUpdate(
            thought.userId,
            {$pull: {thoughts: thought._id}},
            {new: true}
        );

        if(!updatedUser){
            console.warn(`User ${thought.userId} not found when deleting thought ${thought._id}`);
        }

        res.status(200).json({
            message: "Thought deleted succesfully",
            deletedThought: thought,
            updatedUser: updatedUser
            
        });
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Unable to delete thought", error: err.message});
    }
}

/// --------------Reactions Section--------------

//Get all reactions for a thought
async function getReactions(req, res){
    try{
        const thought = await Thought.findById(req.params.id);
        if(!thought){
            return res.status(404).json({message: "Thought not found"});
        }
        res.status(200).json({
            message: "Reactions retrieved succesfully",
            thoughtId: thought._id,
            reactions: thought.reactions
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error retrieving reactions",
            error: err.message
        });
    }
}

//Add a reaction for a thought
async function addReaction(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.id,
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }

        res.status(201).json({
            message: "Reaction added successfully",
            thought: thought
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid thought ID format" });
        }
        res.status(500).json({ message: "Error adding reaction", error: err.message });
    }
}
//Delete reaction from a thought
async function deleteReaction(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }

        // Check if the reaction was removed
        const reactionRemoved = thought.reactions.id(req.params.reactionId) === null;

        if (reactionRemoved) {
            res.json({
                message: "Reaction deleted successfully",
                thought: thought
            });
        } else {
            res.status(404).json({ message: "Reaction not found" });
        }
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid thought ID or reaction ID format" });
        }
        res.status(500).json({ message: "Error deleting reaction", error: err.message });
    }
}





module.exports = {
    getThoughts,
    getThought,
    addThoughts,
    deleteThought,
    updateThought,
    getReactions,
    addReaction,
    deleteReaction

}