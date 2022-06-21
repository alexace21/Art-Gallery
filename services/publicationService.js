const Publication = require('../models/Publication');

exports.create = (publicationData) => Publication.create(publicationData);

exports.getAll = () => Publication.find();
exports.getOneDetailed = (publicationId) => Publication.findById(publicationId).populate('author');

exports.getOne = (publicationId) => Publication.findById(publicationId); 