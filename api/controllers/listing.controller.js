import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(401, 'Listing not found'));

    res.status(200).json(listing);
  }
  catch(error){
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try{
    const limit = parseInt(req.query.limit) || 9; // default limit to 9 results
    const startIndex = parseInt(req.query.startIndex) || 0; // default startIndex to 0

    let offer = req.query.offer; // default to all offers
    if(offer === undefined || offer === 'false') {
      offer = { $in: [false, true] }; 
    } 

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false') { 
      furnished = { $in: [false, true] }; 
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if(type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || ''; // default to empty string
    const sort = req.query.sort || 'createdAt'; // default to sort by createdAt
    const order = req.query.order || 'desc'; // default to descending
    
    const listings = await Listing.find({ // find all listings that match the search term
      name: { $regex: searchTerm, $options: 'i' }, // search by name and make it case-insensitive
      offer, // filter by offer
      furnished, // filter by furnished
      parking, // filter by parking 
      type, // filter by type
    })
    .sort({ [sort]: order }) // sort by the field specified in the query
    .limit(limit) // limit the number of results
    .skip(startIndex); // skip the first x results

    return res.status(200).json(listings);
  }
  catch(err) {
    next(err);
  }
};
