const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");
const Movie = require("./movieModel");

const Screen = sequelize.define(
  "Screen",
  {
    Screen_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    theatre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Theatre",
        key: "theatre_id",
      },
    },
  },
  {
    timestamps: true,
  }
);
Theatre.hasMany(Screen, { foreignKey: 'theatre_id' });
Screen.belongsTo(Theatre, { foreignKey: 'theatre_id' });

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log("Screen table created successfully");
  } catch (error) {
    console.error("Error syncing model with database:", error);
  }
})();

module.exports = Screen;
