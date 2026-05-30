const listingModel = require('../models/listing.model');

async function createListing(req, res, next) {
  try {
    const listing = await listingModel.create(req.body);

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

module.exports = { createListing };