const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required!'],
    },
    paintingTechnique:{
        type: String,
        required: [true, 'Painting-technique is required!'],
    },
    artPicture:{
        type: String,
        required: [true, 'artPicture is required!'],
    },
    certificate: {
        type: String,
        enum: ['Yes', 'No'],
        require: [true, 'Certificate is required!']
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    usersShared: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports= Publication;