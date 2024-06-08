const express = require("express");
const app = express();

const Movie = require("../model/movieModel");

exports.addMovie = async (req, res) => {
  try {
    const { title, cast, duration, rating } = req.body;
    const isExistMovie = await Movie.findOne({ where: { title } });
    if (isExistMovie) {
      return res.status(403).json({
        success: false,
        massage: "Movie Already exists",
      });
    }

    const newMovie = await Movie.create({
      title,
      cast,
      duration,
      rating,
    });

    await newMovie.save();

    return res.status(201).json({
      success: true,
      message: "Movie Registered Successfully",
      data: newMovie,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.addMovieBulk = async (req, res) => {
  try {
    const MoviesToRegister = req.body; // Assuming req.body is an array of Movie objects

    if (MoviesToRegister.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Movies to register.",
      });
    }

    // Extracting unique emails from the array of Movies
    const emails = MoviesToRegister.map((Movie) => Movie.email);

    // Checking if any Movie already exists with the provided emails
    const existingMovies = await Movie.findAll({
      where: { email: { [Op.in]: emails } },
    });
    if (existingMovies.length > 0) {
      const existingEmails = existingMovies.map((Movie) => Movie.email);
      const duplicateEmails = existingEmails.join(", ");
      return res.status(403).json({
        success: false,
        message: `Movies with the following emails already exist: ${duplicateEmails}`,
      });
    }

    // Hashing passwords for all Movies
    const MoviesWithHashedPasswords = await Promise.all(
      MoviesToRegister.map(async (Movie) => {
        const hashedPassword = await bcrypt.hash(Movie.password, 10);
        return {
          Moviename: Movie.Moviename,
          email: Movie.email,
          password: hashedPassword,
        };
      })
    );

    // Bulk create Movies in the database
    const registeredMovies = await Movie.bulkCreate(MoviesWithHashedPasswords);

    return res.status(201).json({
      success: true,
      message: "Movies Registered Successfully",
      data: registeredMovies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.getAllMovie = async (req, res) => {
  try {
    let { page, limit } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const size = parseInt(limit);
    const offset = (page - 1) * size;
    const Movies = await Movie.findAndCountAll({
      size,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: Movies.rows,
      totalPages: Math.ceil(Movies.count / size),
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.singleMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllMovies = await Movie.findOne({ where: { Movie_id: id } });
    // const getAllMovies =findAllMovies.every(Movie => Movie instanceof Movie)
    // console.log(getAllMovies)
    return res.status(200).json({
      success: true,
      message: "Get Movie",
      data: getAllMovies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const {title,
        cast,
        duration,
        rating, } = req.body;
    const id = req.params.id;

    // Check if the Movie exists
    const existingMovie = await Movie.findOne({ where: { Movie_id: id } });
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie does not exist",
      });
    }

    // Update the Movie with provided fields
    const updatedMovie = await Movie.update(
      { title,title,
        cast,
        duration,
        rating, },
      { where: { Movie_id:id } }
    );

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
exports.deleteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const isExistMovie = await Movie.findOne({ where: {Movie_id: id } });

    if (!isExistMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie does not exist",
      });
    }
    const deleteMovie = await Movie.destroy({ where: { Movie_id:id } });
    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
      data: isExistMovie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
