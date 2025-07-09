import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9_-]+$/, "Shortcode must be alphanumeric"],
  },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [
    {
      timestamp: { type: Date, default: Date.now },
      source: String,
      location: String,
    },
  ],
});

const Url = mongoose.model("Url", UrlSchema);

export default Url;
