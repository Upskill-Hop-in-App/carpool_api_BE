**# Carpool API BE**

This is the ****Carpool API**** for managing the rides, lifts, cars and it's users.

It is built with ****Node.js**** and uses ****MongoDB**** and ****SQLite**** for data storage.

The API allows Hop In administrators and users to manage data related to it's use. It also includes authentication and authorization features, ensuring secure access based on user roles (admin, client).

**## 🖋️ Documentation & API Routes**

- ***Swagger Documentation****: API documentation is automatically generated and accessible via Swagger UI at http://localhost:3000/api-docs/.

**### 🚗 Lifts**

- ***POST****: /api/lifts: Create a new lift
- ***GET****: /api/lifts: Retrieve all lifts
- ***GET****: /api/lifts/filter/${req.query}: Retrieve a lift by its code
- ***PUT****: /api/lift/status: Update a lift status by its code
- ***PUT****: /api/lift/rating: Update a lift rating by its code
- ***DELETE****: /api/lifts: Delete a lift
- ***GET****: /api/lift by username: Retrieve a lift by a username

**### 🚗 Applications**

- ***POST****: /api/applications: Create a new application
- ***GET****: /api/applications: Retrieve all applications
- ***GET****: /api/applications/ca/${req.params.ca}: Retrieve a application by its code
- ***GET****: /api/applications/username/ Retrieve a application by username
- ***GET****: /api/applications/email/:email: Retrieve a application by email
- ***GET****: /api/applications/status/:status: Retrieve a application by status
- ***PUT****: /api/lift/rating: Update a application rating by its code
- ***GET****: /api/applications/username/status/:username/:status: Retrieve a application by username and status
- ***GET****: /api/applications/email/status/${req.params.email}/${req.params.status}: Retrieve a application ny email and status
- ***PUT****: /api/application/accept/:ca Update application accepted
- ***PUT****: /api/application/reject/:ca Update application reject
- ***PUT****: /api/application/cancel/:ca Update application cancel
- ***PUT****: /api/application/ready/:ca: Update Passenger ready
- ***PUT****: /api/application/ca/rating/:ca/:rating Update Passenger rating

**### 👤 Users**

- ***POST****: /api/login: Login a user
- ***POST****: /api/register/client: Create a new client registation
- ***POST****: /api/register/admin: Create a new admin registation
- ***GET****: /api/username/:username: get user by username
- ***PUT****: /api/profile/:username: Update a user
- ***PUT****: /api/password/:username: Update a password
- ***DELETE****: /api/delete/:username: Delete a username

**### 🚗 Car**

- ***POST****: /api/cars: Create a car
- ***GET****: /api/filter/username/:username: Filter car by username
- ***GET****: /api//username/:username: Get car by username
- ***PUT****: /api/cars: Update car by code
- ***DELETE****: /api/cars: Delete a car by code

**## 🔧 Features**

- ***CRUD Operations****: Manage applications, lifts, cars, users.
- ***Role-based Authentication & Authorization****: Admins can create/edit/delete data, while clients can create, edit and cancel.
- ***Testing****: The application includes Jest and Supertest for testing the API.
- ***SQLite****: Local authentication and authorization processes using an SQLite database.

**## ⚙️ Prerequisites**

- ***Node.js****: v16 or later
- ***MongoDB****: Running locally, using a cloud instance or docker

2. Install dependencies:

```

yarn

```

Alternatively, use npm:

```

npm i

```

3. Create a `.env` file based on `.env.sample` and enter your variables:

```

cp .env.sample .env

```

4. Run the application:

For development mode (with live reload):

```

yarn dev

```

For production mode:

```

yarn start

```

**## 🧪 Tests**

1. To run tests:

```

yarn test

```

Using docker: Follow BUILD.md instructions

**## 🐋 Docker**

1. To run with docker, follow the BUILD.md instructions

2. To run tests with docker, follow the BUILD.md instructions

**## 💼 License**

This project is licensed under the MIT License.

**## 👥 Contact**

This project was developed by Capicua Team with support from UpSkill.

- 👉 Bernardo Veiga: [GitHub](https://github.com/jbveiga)
- 👉 Carlos Reis: [GitHub](https://github.com/candreis)
- 👉 Lucas Garcia: [GitHub](https://github.com/garcialucasm)
- 👉 Luis Pires: [GitHub](https://github.com/Luis-Pires)
- 👉 Telmo Nunes: [GitHub](https://github.com/Tgbn99)