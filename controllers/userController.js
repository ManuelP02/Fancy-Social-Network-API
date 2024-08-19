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

module.exports= {
    getAllUsers,
    getUser,
    createUser,
    updateUser
}