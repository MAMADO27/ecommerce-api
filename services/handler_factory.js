const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');



exports.delete_one = (Model) =>asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
        return next(new api_error('document not found', 404));
    }
    document.remove();
    res.status(204).json({ message: 'document deleted successfully' });
});


exports.update_one = (Model) =>asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    const document = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!document) {
        return next(new api_error('document not found', 404));
    }
    document.save();
    res.status(200).json({ data: document });
});


exports.create_one = (Model) =>asyncHandler(async (req, res) => {
    if (req.user && req.user._id) {
    req.body.user = req.user._id;
    }
    const document= await Model.create({ ...req.body });
    res.status(201).json({ data: document});
});


exports.get_one = (Model, populate_options) => asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    let query = Model.findById(id);
    if (populate_options) {
        query = query.populate(populate_options);
    }
    const document = await query;
    if (!document) {
        return next(new api_error('Brand not found', 404));
    }
    res.status(200).json({ data: document });
});


exports.get_all = (Model,model_name) => asyncHandler(async (req, res) => {
    let filter = {};
    if(req.filter_object) {
        filter = req.filter_object;
    }
    const count_docs = await Model.countDocuments(); 
    const apiFeatures = new api_fetchers(Model.find(filter), req.query)
      .search(model_name)
      .filter()
      .sort()
      .limitFields()
      .paginate(count_docs);
    const {mongooseQuery,pagination_result}= apiFeatures;
    const document = await mongooseQuery;
    
    res.status(200).json({ results: document.length,pagination_result , data: document });
});