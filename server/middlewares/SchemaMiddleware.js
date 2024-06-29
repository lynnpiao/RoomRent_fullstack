const Joi = require("joi");

//Validation For create Apartment
// Joi validation schema 
const apartmentSchema = Joi.object({
    address: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    zipCode: Joi.string().allow(null, ''),
    contact_email: Joi.string().email().max(100).required(),
    contact_phone: Joi.string().max(100).allow(null),
});

// Middleware for validating request data
const validateApartment = (req, res, next) => {
    const { error } = apartmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const partialApartmentSchema = Joi.object({
    description: Joi.string().required(),
    contact_email: Joi.string().email().max(100).required(),
    contact_phone: Joi.string().max(100).allow(null),
});


// Middleware for validating request data
const validatePartialApartment = (req, res, next) => {
    const { error } = partialApartmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}

module.exports = { 
    validateApartment,
    validatePartialApartment
};