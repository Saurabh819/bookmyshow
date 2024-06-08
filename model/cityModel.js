const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");

const City = sequelize.define("City", {
  city_id: {
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

 (async () => {
      try {
        await sequelize.sync({ force: true }); // This will drop the table if it already exists
        console.log('City table created successfully');
      } catch (error) {
        console.error('Error syncing model with database:', error);
      }
    })();

module.exports = City;


