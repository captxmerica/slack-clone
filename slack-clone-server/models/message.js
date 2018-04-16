export default (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    name: DataTypes.STRING,
  });
  // belongsTo notes a 1 to many relationship
  Message.associate = (models) => {
    Message.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return Message;
};
