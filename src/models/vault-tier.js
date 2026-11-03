module.exports = (sequelize, DataTypes) =>
    sequelize.define(
      'VaultTier',
      {
        tier_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        tier_name: {
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        coin_multiplier: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        stealth_penalty: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        loot_rate: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        unlock_threshold: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: 'vault_tiers',
        timestamps: false,
      }
    );