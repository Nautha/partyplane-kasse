function wrapAsync(fn) {
    return (req, res, next) => fn(req, res).then(next).catch(next);
}

module.exports = {wrapAsync};