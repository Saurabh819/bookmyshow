const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");
const Movie = require("./movieModel");

const Show = sequelize.define(
  "Show",
  {
    Show_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    show_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    movie: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Movie",
        key: "movie_id",
      },
    },
    screen_id:{
        type: DataTypes.INTEGER,
        references: {
          model: "Screen",
          key: "screen_id",
        },
    }
  },
  {
    timestamps: true,
  }
);

Movie.hasMany(Show, { foreignKey: 'movie_id' });
Show.belongsTo(Movie, { foreignKey: 'movie_id' });

Screen.hasMany(Show, { foreignKey: 'screen_id' });
Show.belongsTo(Screen, { foreignKey: 'screen_id' });

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log("Show table created successfully");
  } catch (error) {
    console.error("Error syncing model with database:", error);
  }
})();

module.exports = Show;
