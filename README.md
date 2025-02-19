# API Documentation

This document provides details about the API endpoints for the application.

## Authentication

Most endpoints require authentication using a JSON Web Token (JWT). The token should be included in the `Authorization` header as a Bearer token:

```
Authorization: Bearer <token>
```

## User Endpoints

### 1. Create User

- **Endpoint:** `/api/users`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "type": "user",
    "userPrograms": []
  }
  ```
- **Response:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user",
    "userPrograms": []
  }
  ```
  **Note:** Creating a new admin user is restricted via the API. Please create an admin user directly in the database first.
- **Response Status Codes:**
  - 201 Created: User successfully created.
  - 400 Bad Request: Error creating user (e.g., invalid input).

### 2. Login User

- **Endpoint:** `/api/users/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "...", // JWT token
     "user": {
        "email": "user@example.com",
        "name": "John Doe",
        "type": "user",
        "userPrograms": []
     }
  }
  ```
- **Response Status Codes:**
  - 200 OK: Login successful, token returned.
  - 401 Unauthorized: Authentication failed (user not found or wrong password).
  - 500 Internal Server Error: Server error.

### 3. Get User Details

- **Endpoint:** `/api/users/:email`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user",
    "userPrograms": [
      {
        "programName": {
            "_id": "...",
            "programName": "Program 1",
            ... // other program details
        },
        "programStartDate": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```
- **Response Status Codes:**
  - 200 OK: User details returned.
  - 404 Not Found: User not found.
  - 500 Internal Server Error: Server error.

### 4. Assign Program

- **Endpoint:** `/api/users/:email/programs`
- **Method:** `POST`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "programName": "Program 1",
    "programStartDate": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Response:** User object with updated `userPrograms`.
- **Response Status Codes:**
  - 200 OK: Program assigned successfully.
  - 400 Bad Request: Program already assigned to user.
  - 404 Not Found: User or program not found.

## Program Endpoints

### 1. Create Program

- **Endpoint:** `/api/programs`
- **Method:** `POST`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "programName": "Program 1",
    "programLength": 2,
    "weeklyActivities": [
      {
        "week": 1,
        "activities": [
          {
            "activityId": "uniqueId1",
            "category": "Athleticism",
            "activityName": "Running",
            "activityFrequency": {
              "type": "daily",
              "days": [0, 1, 2, 3, 4, 5, 6],
              "timesPerDay": 1
            },
            "activityTime": 30
          }
        ]
      },
      {
        "week": 2,
        "activities": [
          {
            "activityId": "uniqueId2",
            "category": "Memory",
            "activityName": "Memory Game",
            "activityFrequency": {
              "type": "daily",
              "days": [0, 1, 2, 3, 4, 5, 6],
              "timesPerDay": 2
            },
            "activityTime": 15
          }
        ]
      }
    ]
  }
  ```
- **Response:** The created program object.
- **Response Status Codes:**
  - 201 Created: Program successfully created.
  - 400 Bad Request: Error creating program (e.g., invalid input).

### 2. Get All Programs

- **Endpoint:** `/api/programs`
- **Method:** `GET`
- **Authentication:** Required
- **Response:** An array of program objects.
- **Response Status Codes:**
  - 200 OK: Programs successfully retrieved.
  - 500 Internal Server Error: Server error.

### 3. Get Program by Name

- **Endpoint:** `/api/programs/:programName`
- **Method:** `GET`
- **Authentication:** Required
- **Response:** The requested program object, or a 404 error if not found.
- **Response Status Codes:**
  - 200 OK: Program successfully retrieved.
  - 404 Not Found: Program not found.
  - 500 Internal Server Error: Server error.

### 4. Update Program

- **Endpoint:** `/api/programs/:programName`
- **Method:** `PUT`
- **Authentication:** Required (Admin only)
- **Request Body:** Include the fields to be updated. Refer to the `Create Program` section and `programsModel.js` for the complete structure.
- **Response:** The updated program object, or a 404 error if not found.
- **Response Status Codes:**
  - 200 OK: Program successfully updated.
  - 400 Bad Request: Error updating program (e.g., invalid input).
  - 404 Not Found: Program not found.

### 5. Delete Program

- **Endpoint:** `/api/programs/:programName`
- **Method:** `DELETE`
- **Authentication:** Required (Admin only)
- **Response:**
  ```json
  {
    "message": "Program deleted"
  }
  ```
- **Response Status Codes:**
  - 200 OK: Program successfully deleted.
  - 404 Not Found: Program not found.
  - 500 Internal Server Error: Server error.

## Progress Endpoints

### 1. Get Progress

- **Endpoint:** `/api/progress/:userEmail/:programName/:day`
- **Method:** `GET`
- **Authentication:** Required
- **Response:**
  ```json
  {
    "day": 1,
    "activities": [
      {
        "activityId": "uniqueId1",
        "completed": false,
        "completions": 0
      }
    ]
  }
  ```
- **Response Status Codes:**
  - 200 OK: Progress successfully retrieved.
  - 404 Not Found: Progress not found for this user, program, or day.
  - 500 Internal Server Error: Server error.

### 2. Update Progress

- **Endpoint:** `/api/progress/:userEmail/:programName/:day`
- **Method:** `PUT`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "activities": [
      {
        "activityId": "uniqueId1",
        "completed": true,
        "completions": 2
      }
    ]
  }
  ```
- **Response:** The updated daily progress object.
- **Response Status Codes:**
  - 200 OK: Progress successfully updated.
  - 403 Forbidden: User tried to update progress for a day that is not the current program day.
  - 404 Not Found: User or program not found.
  - 500 Internal Server Error: Server error.
- **Note:** Users can only update progress for the *current* program day, calculated from their `programStartDate`.