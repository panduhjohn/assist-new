const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const IndustrySchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, required: true, trim: true},
    password: { type: String, required: true, trim: true },
    picture: { type: String, default: '' },
    address: { type: String, default: 'Please update address', trim: true },
    city: { type: String, default: 'Please update city', trim: true },
    state: { type: String, default: 'Please update state', trim: true },
    admin: { type: Boolean, default: true },
});

IndustrySchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('Industry', IndustrySchema);
