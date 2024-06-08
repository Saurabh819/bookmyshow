const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");

const Payment = sequelize.define("Payment", {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Booking,
      key: "booking_id",
    },
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

Booking.hasMany(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log("Payment table created successfully");
  } catch (error) {
    console.error("Error syncing model with database:", error);
  }
})();

module.exports = Payment;
