import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  originalUrl: { 
    type: String, 
    required: true,
    index: true
  },
  shortCode: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  expiry: { type: Date, required: true, index: true },
  clicks: [{
    timestamp: { type: Date, default: Date.now },
    source: String,
    location: String,
    userAgent: String
  }]
});

UrlSchema.index({ originalUrl: 1 }, { 
  collation: { locale: 'en', strength: 2 } 
});

const Url = mongoose.model("Url", UrlSchema);

export default Url;