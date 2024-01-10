var randomstring = require("randomstring");

function passwordResetToken() {
        const token = randomstring.generate();
        return token;
    }

module.exports = {
    passwordResetToken
  };
  