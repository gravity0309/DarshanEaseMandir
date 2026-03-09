

import { body, validationResult } from "express-validator";

/* CREATE TEMPLE VALIDATION */

export const validateCreateTemple = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Temple name is required")
    .isLength({ min: 3 })
    .withMessage("Temple name must be at least 3 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

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


/* UPDATE TEMPLE VALIDATION */

export const validateUpdateTemple = [

  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Temple name must be at least 3 characters"),

  body("location")
    .optional(),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

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