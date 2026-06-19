# Student API

A complete Node.js + Express REST API for managing student records using in-memory storage.

## Features

- Create, read, update, and delete students
- Search students by name
- Count total students
- Sort students by name
- Request logging middleware
- Error handling middleware
- Input validation
- JSON request and response support

## Project Structure

```text
student-api/
|
├── server.js
├── package.json
├── routes/
│   └── studentRoutes.js
├── controllers/
│   └── studentController.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
└── data/
    └── students.js
```

## Installation

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

If you already have the project files, just run:

```bash
npm install
```

## Run the project

```bash
npm run dev
```

The API will start on:

```text
http://localhost:3000
```

Open the same URL in your browser to use the student dashboard UI.

## API Endpoints

### Root

- `GET /` - API health check

### Students CRUD

- `POST /api/students` - Create a student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student by ID
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Extra Features

- `GET /api/students/search?name=Ayush` - Search students by name
- `GET /api/students/count` - Count all students
- `GET /api/students?sort=name` - Sort students by name

## Student Object Example

```json
{
  "id": 1,
  "name": "Ayush Vekariya",
  "email": "ayush@gmail.com",
  "course": "Computer Engineering",
  "age": 21
}
```

## Sample Requests and Responses

### Create Student

Request:

```json
{
  "name": "Ayush Vekariya",
  "email": "ayush@gmail.com",
  "course": "Computer Engineering",
  "age": 21
}
```

Response:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 2,
    "name": "Ayush Vekariya",
    "email": "ayush@gmail.com",
    "course": "Computer Engineering",
    "age": 21
  }
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "A valid email is required."
  ]
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Student not found"
}
```

## Postman Testing Guide

### 1. Create Student

- Method: `POST`
- URL: `http://localhost:3000/api/students`
- Body: raw JSON

```json
{
  "name": "Rahul Shah",
  "email": "rahul@example.com",
  "course": "Computer Engineering",
  "age": 20
}
```

### 2. Get All Students

- Method: `GET`
- URL: `http://localhost:3000/api/students`

### 3. Get Single Student

- Method: `GET`
- URL: `http://localhost:3000/api/students/1`

### 4. Update Student

- Method: `PUT`
- URL: `http://localhost:3000/api/students/1`
- Body: raw JSON

```json
{
  "name": "Ayush Vekariya",
  "email": "ayush.vekariya@gmail.com",
  "course": "Information Technology",
  "age": 22
}
```

### 5. Delete Student

- Method: `DELETE`
- URL: `http://localhost:3000/api/students/1`

### 6. Search Student by Name

- Method: `GET`
- URL: `http://localhost:3000/api/students/search?name=Ayush`

### 7. Count Students

- Method: `GET`
- URL: `http://localhost:3000/api/students/count`

## Status Codes Used

- `200 OK` - Successful read, update, delete
- `201 Created` - Successful create
- `400 Bad Request` - Validation or bad input
- `404 Not Found` - Missing route or student
- `500 Internal Server Error` - Unexpected server error
