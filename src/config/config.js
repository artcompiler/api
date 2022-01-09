const buildGetConfig = ({ global }) => {
  return () => global.config;
};
exports.buildGetConfig = buildGetConfig;
