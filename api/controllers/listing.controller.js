const listingModel = require('../models/listing.model');
const { errorHandler } = require('../utils/error');

async function createListing(req, res, next) {
  try {
    const listing = await listingModel.create(req.body);

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

async function deleteListing(req, res, next) {
  try {
    const listing = await listingModel.findById(
      req.params.id
    );

    if (!listing) {
      return next(
        errorHandler(404, 'Listing not found!')
      );
    }

    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(
          401,
          'You can delete only your own listing!'
        )
      );
    }

    await listingModel.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json(
      'Listing deleted successfully!'
    );

  } catch (error) {
    next(error);
  }
}

async function updateListing(req, res, next) {
  try {
    const listing = await listingModel.findById(
      req.params.id
    );

    if (!listing) {
      return next(
        errorHandler(404, 'Listing not found!')
      );
    }

    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(
          401,
          'You can update only your own listing!'
        )
      );
    }

    const updatedListing =
      await listingModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          returnDocument: 'after',
        }
      );

    res.status(200).json(updatedListing);

  } catch (error) {
    next(error);
  }
}

async function getListing(req, res, next) {
  try {
    const listing =
      await listingModel.findById(
        req.params.id
      );

    if (!listing) {
      return next(
        errorHandler(
          404,
          'Listing not found!'
        )
      );
    }

    res.status(200).json(listing);

  } catch (error) {
    next(error);
  }
}


async function getListings(req,res,next) {
  try {
    const limit = parseInt(req.query.limit) || 9;

    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer = req.query.offer === 'true'
        ? true
        : { $in: [true, false] };

    const furnished =
  req.query.furnished === 'true'
    ? true
    : { $in: [true, false] };

    const parking = req.query.parking === 'true'
        ? true
        : { $in: [true, false] };

    const type = req.query.type === 'all' || !req.query.type
        ? { $in: ['sale', 'rent'] }
        : req.query.type;

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await listingModel.find({
        name: {
          $regex: searchTerm,
          $options: 'i',
        },
        offer,
        furnished,
        parking,
        type,
      })
      .limit(limit).skip(startIndex)
      .sort({ [sort]: order});

    res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}

module.exports = { createListing, deleteListing, updateListing, getListing, getListings };