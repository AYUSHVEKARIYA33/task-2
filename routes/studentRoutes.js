const express = require("express");
const {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentCount,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/search", searchStudents);
router.get("/count", getStudentCount);
router.get("/", getAllStudents);
router.post("/", createStudent);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
