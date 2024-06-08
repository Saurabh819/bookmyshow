const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://saurabh:1010@localhost:5432/bookmyshow"
);
const { v4: UUIDV4 } = require("uuid");

const Admin = sequelize.define(
  "Admin",
  {
    admin_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"), 
      allowNull: false,
      defaultValue: "user", // Default role is user
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }
  // {
  //   indexes: [
  //     {
  //       unique: true,
  //       fields: ['email'] // Index the email column
  //     }
  //   ]
  // }
);

// (async () => {
//   try {
//     await sequelize.sync({ force: true }); // This will drop the table if it already exists
//     console.log('Admin table created successfully');
//   } catch (error) {
//     console.error('Error syncing model with database:', error);
//   }
// })();

module.exports = Admin;

// console.log(User === sequelize.models.User);
