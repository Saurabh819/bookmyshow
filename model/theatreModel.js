const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");
const Movie = require("./movieModel");

const Theatre = sequelize.define(
  "Theatre",
  {
    Theatre_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "City",
        key: "city_id",
      },
    },
  },
  {
    timestamps: true,
  }
);

City.hasMany(Theatre, { foreignKey: 'city_id' });
Theatre.belongsTo(City, { foreignKey: 'city_id' });

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log("Theatre table created successfully");
  } catch (error) {
    console.error("Error syncing model with database:", error);
  }
})();

module.exports = Theatre;
