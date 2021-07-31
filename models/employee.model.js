const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    cname: {
        type: String,
    },
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    vnn: {
        type: String,
        required: 'This field is required.'
    },
    oname: {
        type: String
    },
    lp: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    }
});



mongoose.model('Employee', employeeSchema);
