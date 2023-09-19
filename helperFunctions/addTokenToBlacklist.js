const blacklistTokens = [];

const addTokenToBlacklist = (token) => {
  blacklistTokens.push(token);
  return blacklistTokens;
};

module.exports = {
    blacklistTokens, addTokenToBlacklist
}