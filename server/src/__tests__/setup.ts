import mongoose from "mongoose";

// Setup in-memory MongoDB for integration tests (if needed)
beforeAll(async () => {
  // Could connect to test database
});

afterAll(async () => {
  await mongoose.disconnect();
});
