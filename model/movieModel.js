const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");

const Movie = sequelize.define(
  "Movie",
  {
    Movie_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cast: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0, 
    },
},
  {
    timestamps:true
}
);

// (async () => {
//   try {
//     await sequelize.sync({ force: true }); // This will drop the table if it already exists
//     console.log('Movie table created successfully');
//   } catch (error) {
//     console.error('Error syncing model with database:', error);
//   }
// })();

module.exports = Movie;


