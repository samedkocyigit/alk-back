const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A User must have a name!"],
    trim: true,
    min: [2, "A user name mus have more or equal than 2 characters"],
    max: [40, "A user name mus have less or equal than 40 characters"],
  },
  surname: {
    type: String,
    required: [true, "A User must have a surname!"],
    min: [2, "A user name mus have more or equal than 2 characters"],
    max: [40, "A user name mus have less or equal than 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  gender: {
    type: String,
    enum: ["erkek", "kadin", "belirtmek-istemiyorum"],
    default: "belirtmek-istemiyorum",
  },
  telNumber: {
    type: {
      countryCode: {
        type: Number,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  companyName: {
    type: String,
    min: 5,
    max: 80,
  },
  role: {
    type: String,
    Enum: ["admin", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
  },
  taxOffice: String,
  taxNumber: Number,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual("fullName").get(function () {
  return this.name + " " + this.surname;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
