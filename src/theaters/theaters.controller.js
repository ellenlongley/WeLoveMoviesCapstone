const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list(req, res, next) {
    theatersService
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
    list: asyncErrorBoundary(list),
}