const students = [
  {
    id: 1,
    name: "Ayush Vekariya",
    email: "ayush@gmail.com",
    course: "Computer Engineering",
    age: 21,
  },
];

let nextId = 2;

const getNextId = () => nextId++;

module.exports = {
  students,
  getNextId,
};
