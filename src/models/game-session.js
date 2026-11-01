module.exports = (sequelize, DataTypes) =>
    sequelize.define(
      'GameSession',
      {
        session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        join_code: { type: DataTypes.STRING(6), allowNull: false },
        set_id: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'waiting' },
        started_at: { type: DataTypes.DATE, allowNull: true },
        ended_at: { type: DataTypes.DATE, allowNull: true },
      },
      { tableName: 'sessions', timestamps: false }
    );