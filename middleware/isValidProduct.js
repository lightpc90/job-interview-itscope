const isValidProduct = (req, res, next) => {
    const {status} = req.body;
    let quantity = parseInt(req.body.quantity);
    if (status !== "in_draft" && status !== "available" && status !== "sold") {
      return res.status(400).json({
        error: "product status can only be 'in_draft', 'available' or 'sold' ",
      });
    }
    if (status === "sold" && quantity !== 0) {
      return res
        .status(400)
        .json({ error: "quantity must be zero if status is sold" });
    }
    next()
}

module.exports = isValidProduct