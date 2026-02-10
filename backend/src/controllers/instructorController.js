exports.getProfile = async (req, res) => {
  res.json(req.user || {});
};

exports.updateProfile = async (req, res) => {
  try {
    Object.assign(req.user.profile, req.body);
    await req.user.save();
    res.json(req.user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
