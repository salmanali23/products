import { NextApiHandler } from "next";
import db from "../../../db/db";
import { Product } from "../../../types/product";

/**
 * GET /api/products
 *
 */
export type GetProductsQuery = {
  /**
   * Current page (1-indexed)
   */
  page?: string;
  /**
   * Number of products to take (limit)
   */
  take?: string;
};

/**
 * GET /api/products
 *
 * Your API must return a response in this format.
 */
export type GetProductsResponse = {
  /**
   * Current page (1-indexed)
   */
  page: number;
  /**
   * Number of taken products (limit)
   */
  take: number;
  /**
   * Number of products in this page
   * (may be less than `take` if there are not enough products)
   */
  count: number;
  /**
   * Total number of products in the database
   */
  totalCount: number;
  /**
   * Total number of pages
   */
  pages: number;
  /**
   * Products in this page
   */
  products: Product[];
};

// TODO: Make this function perform pagination and return the right response
const productsIndex: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // Query params
  const query = req.query;

  const {page, take} = query;

  const offset = (page - 1 ) * take;

  const result = (await db.query(`SELECT * FROM "product" LIMIT ${take} OFFSET ${offset}`)) as Product[];

  const totalResult = await db.query('SELECT COUNT(*) from "product"');
  const totalCount = parseInt(totalResult[0].count);

  const totalPages = Math.ceil(totalCount / take);
  const response: GetProductsResponse = {
    page: parseInt(page),
    take: parseInt(take),
    count: take,
    totalCount: totalCount,
    pages: totalPages,
    products: result,
  };
  res.status(200).json(response);
};

export default productsIndex;
