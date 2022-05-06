//? VIDEO 447. Joi Validation Middleware
// const { required } = require("joi");

const BaseJoi = require("joi"); //web form client side validation
const sanitizeHtml = require("sanitize-html");

//*VIDEO 568 SANITIZING HTML w/JOI - ALTERNATIVE WOULD BE TO USE npm express-validator
//568 - added escapeHTML() anytime we have text
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(), //Video 542 to delete images
});

//? VIDEO 467 Validating REviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
