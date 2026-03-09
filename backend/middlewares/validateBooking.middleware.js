import { body, validationResult } from "express-validator";

export const validateBooking = [
  body("slotId")
    .notEmpty()
    .withMessage("Slot ID is required")
    .isMongoId()
    .withMessage("Invalid Slot ID"),

  body("persons")
    .notEmpty()
    .withMessage("Number of persons required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Persons must be between 1 and 10"),

  body("visitDate")
    .notEmpty()
    .withMessage("Visit date required")
    .isISO8601()
    .withMessage("Invalid date format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];