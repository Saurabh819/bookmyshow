const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");


const Booking = sequelize.define('Booking', {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    show_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Show,
        key: 'show_id'
      }
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seats_booked: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },{timestamps:true})

  Show.hasMany(Booking, { foreignKey: 'show_id' });
  Booking.belongsTo(Show, { foreignKey: 'show_id' });
(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log("Booking table created successfully");
  } catch (error) {
    console.error("Error syncing model with database:", error);
  }
})();

module.exports = Booking;
