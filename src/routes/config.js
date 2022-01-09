const buildConfigHandler = ({ getConfig }) => (req, res) => {
  res.status(200).json(getConfig());
};
exports.buildConfigHandler = buildConfigHandler;
