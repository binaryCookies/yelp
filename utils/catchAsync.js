//? VIDEO 443. Defining Express Error Class

module.exports = (func) => {
  return (req, res, next) => func(req, res, next).catch(next);
};
