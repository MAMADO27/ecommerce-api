class api_fetchers {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.mongoQuery = {}; // نجمع فيه كل شروط الفلترة والبحث
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    for (const key in queryObj) {
      if (key.includes('[')) {
        const [field, operator] = key.split('[');
        const cleanOperator = operator.replace(']', '');
        if (!this.mongoQuery[field]) this.mongoQuery[field] = {};
        this.mongoQuery[field][`$${cleanOperator}`] = isNaN(queryObj[key]) ? queryObj[key] : +queryObj[key];
      } else {
        this.mongoQuery[key] = isNaN(queryObj[key]) ? queryObj[key] : +queryObj[key];
      }
    }

    return this;
  }

  search(model_name) {
  if (this.queryString.search) {
    const search = this.queryString.search;
    let searchCondition;

    if (model_name === 'products') {
      searchCondition = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    } else if (model_name === 'brands' || model_name === 'categories' || model_name === 'subcategories') {
      searchCondition = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ]
      };
    } else {
      searchCondition = {
        title: { $regex: search, $options: 'i' },
      };
    }

    if (Object.keys(this.mongoQuery).length > 0) {
      this.mongoQuery = { $and: [this.mongoQuery, searchCondition] };
    } else {
      this.mongoQuery = searchCondition;
    }
  }

  this.mongooseQuery = this.mongooseQuery.find(this.mongoQuery);

  return this;
}

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  paginate(count_docs) {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 5;
    const skip = (page - 1) * limit;
    const end_index = page * limit;

    const pagination = {
      current_page: page,
      limit,
      total_pages: Math.ceil(count_docs / limit),
      total_docs: count_docs,
    };

    if (end_index < count_docs) {
      pagination.next_page = page + 1;
    }
    if (skip > 0) {
      pagination.previous_page = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination_result = pagination;
    return this;
  }
}

module.exports = api_fetchers;
