const { VaultTier } = require('../models');

function findByName(tierName) {
    return VaultTier.findOne({
        where: { tier_name: tierName },
    });
}

module.exports = {
    findByName,
};