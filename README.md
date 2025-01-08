# CurrencyFlow

## Overview

This is a RESTful API built using **Node.js** and **Nest.js** framework for a hypothetical finance application that offers currency exchange functionality. The API allows users to convert currency, register accounts, login, and view their transaction history. It integrates with an external currency exchange API to perform currency conversion. Additionally, **Swagger documentation** has been integrated for easy access and understanding of the available endpoints.

## Technology Stack

- **Backend Framework:** Nest.js (Node.js)
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Currency Exchange API:**  ExchangeRate-API
- **API Documentation:** Swagger

## Running Locally:
To run the application, follow these steps:

1. Clone the repository.
2. Set up a MongoDB instance (locally or use a cloud provider like MongoDB Atlas).
3. **Copy the `.env.example` file to `.env` and add your credentials:**
   - API keys for the currency exchange service (Open Exchange Rates or ExchangeRate-API).
   - MongoDB connection string.
   - JWT secret key for authentication.
   
   Run the following command to copy the `.env.example` file to `.env`:
  ```bash
   cp .env.example .env
  ```

4. Configure the environment variables in the `.env` file with the appropriate credentials.
5. Run the following commands to start the application:

```bash
npm install
npm run start:dev
```

## API Endpoints

Swagger documentation is available at `/api/docs` after the application is running, providing an interactive UI to explore and test all available endpoints.

## Authentication

- The **JWT token** is required for accessing user-related endpoints like `/user/history`.
- The token is returned upon successful login and must be included in the `Authorization` header as a Bearer token.



## Error Handling

- **400 Bad Request:** Invalid input data (e.g., unsupported currencies or invalid amounts).
- **403 Unauthorized:** The user is not authenticated.
- **404 Not Found:** The requested resource could not be found (e.g., user not found).
- **500 Internal Server Error:** Server issues or third-party API failures.

## Database

- **MongoDB** is used to store user data (username and hashed password) and transaction history.
- The transaction history is logged every time a user performs a currency conversion.

## Unit Tests

Unit tests are written to cover all the endpoints:
- **Currency Conversion**
- **User Registration**
- **User Login**
- **Transaction History**

Tests ensure that the API handles edge cases, error scenarios, and correct responses.


## GitHub Repository

The code repository is available on GitHub: [Link to GitHub](https://github.com/KhaldMansour/CurrencyFlow)

## Conclusion

This API provides a comprehensive solution for currency exchange, user registration, and transaction history, with a focus on security, scalability, performance, and ease of use through **Swagger documentation**.
