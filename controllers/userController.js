const {User, Thought} = require('../models');

//Get All Users

async function getAllUsers(req, res){
    try{
        const users = await User.find({});
        res.status(200).json({
            message: "Users retrieved succesfully",
            data: users
        });
    }catch (err){
        console.error(err);
        res.status(500).json({
            message: "Error retrieving users",
            error: err.message
        });
    }
}

// Get user by id
async function getUser(req, res){
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            message: "User found",
            data: user
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error searching for user",
            error: err.message
        });
    }
}


// Post user (create)

async function createUser(req, res){
    try{
        const user = await User.create(req.body);
        res.status(201).json({
            message: "User created succesfully",
            data: user
        });
    }catch(err){
        console.error(err);
        ///Error 11000 is a mongodb duplicate key code
        if(err.code === 11000){
            res.status(400).json({
                message: "Error creating user: duplicate username or email",
                error: err.message
            });
        }else{
            res.status(400).json({
                message: "Error creating user",
                error: err.message
            });
        }
    }
}

// Update user
async function updateUser(req, res){
        try{
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true, runValidators: true}
            );

            if(!updatedUser){
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json({
                message: "User updated succesfully",
                data: updatedUser
            });

        }catch(err){
            console.error(err);
            res.status(500).json({
                message: "Error updating user",
                error: err.message
            });
        }

}

//Delete user by id
async function deleteUser(req, res){
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message: "User not found"});
        }
        //Delete user thoughts 
        await Thought.deleteMany({userId: deletedUser._id});
        //Remove user from friend list
        await User.updateMany(
            {friends: req.params.id},
            {$pull: {friends: req.params.id}}
        );

        res.status(200).json({
            message: "User and related data deleted succesfully",
            data: deletedUser
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error deleting user",
            error: err.message
        });
    }
}

//Get user and it's friends
async function getFriends(req, res){
    try{
        const user = await User.findById(req.params.id)
        .lean()
        .populate("friends","-friends -thoughts -__v");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({
            message: "User and friends retrieved succesfully",
            data: user
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Error retrieving user and friends",
            error: err.message
        });
    }
}

//Add a friend
async function addFriend(req, res) {
    try {
        const user = await User.findById(req.params.userId);
        const friending = await User.findById(req.params.friendId);

        if (!user || !friending) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user._id.toString() === friending._id.toString()) {
            return res.status(400).json({ message: "Cannot friend yourself!" });
        }

        // Check if already friends
        if (user.friends.includes(friending._id)) {
            return res.status(400).json({ message: `Already friends with ${friending.username}` });
        }

        // Add friend to user's friends list
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );

        // Add user to friend's friends list
        await User.findByIdAndUpdate(
            req.params.friendId,
            { $addToSet: { friends: req.params.userId } }
        );

        res.status(200).json({
            message: "Added to friends list!",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error adding friend",
            error: err.message
        });
    }
}

async function deleteFriend(req, res) {
    try {
        const user = await User.findById(req.params.userId);
        const unfriending = await User.findById(req.params.friendId);

        if (!user || !unfriending) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Remove friend from user's friends list
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );

        // Remove user from friend's friends list
        await User.findByIdAndUpdate(
            req.params.friendId,
            { $pull: { friends: req.params.userId } }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found after update" });
        }

        res.status(200).json({
            message: "Friend deleted successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error deleting friend",
            error: err.message
        });
    }
}

//Get thoughts
async function getThoughts(req, res) {
    try {
        const user = await User.findById(req.params.id)
            .lean()
            .populate("thoughts", "-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User thoughts retrieved successfully",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving user thoughts",
            error: err.message
        });
    }
}




module.exports= {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getFriends,
    addFriend,
    deleteFriend,
    getThoughts

}