const { students, getNextId } = require("../data/students");

const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validateStudentInput = (body) => {
  const errors = [];
  const { name, email, course, age } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Name is required and must be a non-empty string.");
  }

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    errors.push("A valid email is required.");
  }

  if (!course || typeof course !== "string" || !course.trim()) {
    errors.push("Course is required and must be a non-empty string.");
  }

  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
    errors.push("Age is required and must be a positive integer.");
  }

  return {
    errors,
    sanitized: {
      name: typeof name === "string" ? name.trim() : name,
      email: typeof email === "string" ? email.trim() : email,
      course: typeof course === "string" ? course.trim() : course,
      age: parsedAge,
    },
  };
};

const sendNotFound = (res, message) => {
  res.status(404).json({
    success: false,
    message,
  });
};

const getAllStudents = async (req, res, next) => {
  try {
    const { sort } = req.query;
    const responseStudents = [...students];

    if (sort === "name") {
      responseStudents.sort((left, right) => left.name.localeCompare(right.name));
    }

    res.status(200).json({
      success: true,
      count: responseStudents.length,
      data: responseStudents,
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { errors, sanitized } = validateStudentInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const student = {
      id: getNextId(),
      ...sanitized,
    };

    students.push(student);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student id must be a valid integer.",
      });
    }

    const student = students.find((item) => item.id === studentId);

    if (!student) {
      return sendNotFound(res, "Student not found");
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student id must be a valid integer.",
      });
    }

    const studentIndex = students.findIndex((item) => item.id === studentId);

    if (studentIndex === -1) {
      return sendNotFound(res, "Student not found");
    }

    const { errors, sanitized } = validateStudentInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const updatedStudent = {
      ...students[studentIndex],
      ...sanitized,
      id: studentId,
    };

    students[studentIndex] = updatedStudent;

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student id must be a valid integer.",
      });
    }

    const studentIndex = students.findIndex((item) => item.id === studentId);

    if (studentIndex === -1) {
      return sendNotFound(res, "Student not found");
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};

const searchStudents = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'name' is required.",
      });
    }

    const query = name.trim().toLowerCase();
    const matches = students.filter((student) => student.name.toLowerCase().includes(query));

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentCount = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: students.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentCount,
};
