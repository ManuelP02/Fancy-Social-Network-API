const mongoose = require('mongoose');

//Reaction Schema as a subdocument
const ReactionSchema = new mongoose.Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp)
    }
},{
    toJSON: {
        getters: true,
    },
    id: false
});

const ThoughtSchema = new mongoose.Schema({
    thoughtText:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp)
    },
    username:{
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

function dateFormat(timestamp){
    return new Date(timestamp).toISOString();
}

const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought; 