const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templates:{}

},{ timestamps: true });

const templateModel = mongoose.models.templates || mongoose.model('templates', templateSchema);

export default templateModel;
