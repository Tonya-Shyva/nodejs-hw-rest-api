const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();
const app = require("../app");
const { MONGODB_URL } = process.env;

beforeAll(() => {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

mongoose.set("strictQuery", false);

describe("POST /login", () => {
  const credentials = {
    email: "tonya11@gmail.com",
    password: "tonya11",
  };

  test("Should return status code 200", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(credentials);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(typeof response.body).toBe("object");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  test("should return 400 Bad Request if email or password is missing", async () => {
    const response = await request(app).post("/api/users/login").send();

    expect(response.status).toBe(400);
  });
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
});
