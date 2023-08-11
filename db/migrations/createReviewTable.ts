import db from "../db";

// TODO: Empty migration
const createReviewTableQuery = `
  CREATE TABLE IF NOT EXISTS review(
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    comment TEXT,
    FOREIGN KEY (productId) REFERENCES product (id)
  )
`;

export const createReviewTable = async () => {
  console.log("Running db/migrations/createReviewTable migration...");
  try {
    console.log('Creating "reviews" table if it doesn\'t exist...');
    await db.query(createReviewTableQuery);
    console.log('Completed - Creating "review" table if it doesn\'t exist...');
    console.log("✅ db/migrations/createReviewTable successful, review table created"
    );
  } catch (err) {
    console.error("❌ Error with db/migrations/createReviewTable migration", err);
  }
};
