module.exports = (sequelize, DataTypes) =>
    sequelize.define(
      'QuestionSet',
      {
        set_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        host_id: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING(80), allowNull: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      },
      { tableName: 'question_sets', timestamps: true, createdAt: 'created_at', updatedAt: false }
    );