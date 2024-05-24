const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, "Category must hava a name"],
    unique: true,
  },
  photos: [String],
  slug: String,
  filter: [
    {
      name: String,
      slug: String,
      values: [{ name: String, slug: String }],
    },
  ],
  sub_category: [
    {
      sub_category_name: { type: String },
      photos: [String],
      slug: String,
      sub_product: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: false,
          unique: false,
        },
      ],
    },
  ],
});

categorySchema.pre("save", function (next) {
  if (this.category_name) {
    this.slug = slugify(this.category_name, { lower: true });
  }

  if (this.sub_category && this.sub_category.length > 0) {
    this.sub_category.forEach((sub) => {
      if (sub.sub_category_name) {
        sub.slug = slugify(sub.sub_category_name, { lower: true });
      }
    });
  }

  if (this.filter && this.filter.length > 0) {
    this.filter.forEach((filter) => {
      if (filter.name) {
        filter.slug = slugify(filter.name, { lower: true });
      }
      if (filter.values && filter.values.length > 0) {
        filter.values.forEach((value) => {
          if (value.name) {
            value.slug = slugify(value.name, { lower: true });
          }
        });
      }
    });
  }

  next();
});

const generateUpdateSlugs = (update) => {
  if (update.category_name) {
    update.slug = slugify(update.category_name, { lower: true });
  }

  if (update.sub_category && Array.isArray(update.sub_category)) {
    update.sub_category = update.sub_category.map((sub) => {
      if (sub.sub_category_name) {
        sub.slug = slugify(sub.sub_category_name, { lower: true });
      }
      return sub;
    });
  }

  if (update.filter && Array.isArray(update.filter)) {
    update.filter = update.filter.map((filter) => {
      if (filter.name) {
        filter.slug = slugify(filter.name, { lower: true });
      }
      if (filter.values && Array.isArray(filter.values)) {
        filter.values = filter.values.map((value) => {
          if (value.name) {
            value.slug = slugify(value.name, { lower: true });
          }
          return value;
        });
      }
      return filter;
    });
  }
};

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  generateUpdateSlugs(update);
  this.setUpdate(update);
  next();
});

categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "sub_category.sub_product",
    select: "-__v ",
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
