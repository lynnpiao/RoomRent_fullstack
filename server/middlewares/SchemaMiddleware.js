const Joi = require("joi");



//Validation For create User
// Joi validation schema 
const userSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
});

// Middleware for validating request data
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


//Validation For create Apartment
// Joi validation schema 
const apartmentSchema = Joi.object({
    address: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    zipCode: Joi.string().optional().allow(null, ''),
    contact_email: Joi.string().email().max(100).required(),
    contact_phone: Joi.string().max(100).optional().allow(null),
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
    contact_phone: Joi.string().max(100).optional().allow(null),
});


// Middleware for validating request data
const validatePartialApartment = (req, res, next) => {
    const { error } = partialApartmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const amenitySchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required()
  });
  
// const amenitiesSchema = Joi.array().items(amenitySchema).min(1);

const validateAmenity = (req, res, next) => {
    const { error } = amenitySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const apartmentAmenitiesSchema = Joi.array().items(Joi.number().integer().required()).min(1);

const validateApartmentAmenities = (req, res, next) => {
    const { error } = apartmentAmenitiesSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const roomAmenitiesSchema = Joi.array().items(Joi.number().integer().required()).min(1);

const validateRoomAmenities = (req, res, next) => {
    const { error } = roomAmenitiesSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const roomSchema = Joi.object({
    aptNumber: Joi.number().integer().required(),
    sqFeet: Joi.number().integer().required(),
    type: Joi.string().required(),
    availableDate: Joi.date().optional(),
    rentPerMonth: Joi.number().integer().required(),
    floor: Joi.number().integer().optional().allow(null),
    minLeaseLength: Joi.number().integer().optional().allow(null),
    apartmentId: Joi.number().integer().optional().allow(null),
});

// Middleware for validating request data
const validateRoom = (req, res, next) => {
    const { error } = roomSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


const partialRoomSchema = Joi.object({

    availableDate: Joi.date().optional(),
    rentPerMonth: Joi.number().integer().required(),
    minLeaseLength: Joi.number().integer().optional().allow(null),
    
});

// Middleware for validating request data
const validatePartialRoom = (req, res, next) => {
    const { error } = partialRoomSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


module.exports = { 
    validateUser,
    validateApartment,
    validatePartialApartment,
    validateAmenity,
    validateApartmentAmenities,
    validateRoomAmenities,
    validateRoom,
    validatePartialRoom
};