const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({ 'string.min': 'Name must be at least 2 characters', 'any.required': 'Name is required' }),
  email: Joi.string().email().required().messages({ 'string.email': 'Please provide a valid email', 'any.required': 'Email is required' }),
  password: Joi.string().min(6).required().messages({ 'string.min': 'Password must be at least 6 characters' }),
  role: Joi.string().valid('donor', 'receiver', 'ngo', 'volunteer', 'admin').required(),
  phone: Joi.string().allow('').optional(),
  organizationName: Joi.string().allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const donationSchema = Joi.object({
  foodTitle: Joi.string().min(3).max(100).required(),
  foodType: Joi.string().required(),
  quantity: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  servesPeople: Joi.number().min(1).required(),
  cookedTime: Joi.string().required(),
  expiryTime: Joi.string().required(),
  pickupAddress: Joi.string().min(5).max(200).required(),
  urgencyLevel: Joi.string().valid('normal', 'urgent').default('normal'),
  description: Joi.string().allow('').max(1000).optional(),
  contactPhone: Joi.string().allow('').optional(),
  location: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional(),
  foodImage: Joi.string().allow('').optional(),
  allergens: Joi.array().items(Joi.string()).optional(),
  foodCategory: Joi.string().allow('').optional(),
  servings: Joi.any().optional(),
  imageUrl: Joi.any().optional(),
  urgency: Joi.any().optional(),
  matchMode: Joi.any().optional(),
}).options({ allowUnknown: true });

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().allow('').optional(),
  bio: Joi.string().allow('').max(500).optional(),
  organizationName: Joi.string().allow('').optional(),
  avatar: Joi.string().allow('').optional(),
  fssaiLicense: Joi.string().allow('').optional(),
  notificationPrefs: Joi.object().optional(),
  address: Joi.string().allow('').optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
  };
}

module.exports = { validate, registerSchema, loginSchema, donationSchema, profileSchema };
