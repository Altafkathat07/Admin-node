const requireLogout = (req, res, next) => {
  if (req.user) {
    return res.status(401).json({ message: "You are already logged in" });
  }
  next();
};

const requireAdmin = async (req, res, next) => {
  const userId = req.session.userId;
  console.log(userId);
  if (!userId) {
    res.redirect("/");
    return;
  }
  next();
};

export { requireLogout, requireAdmin };
