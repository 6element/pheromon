'use strict';

module.exports = (alwaysAuth) => {
  return (req, res, next) => {
    if(req.query.s === process.env.API_WRITE_SECRET || alwaysAuth) {
        return next();
    }
    else {
        return res.status(403).send({
          success: false,
          message: 'No token provided.'
        });
    }
  };
};
