import { NextApiHandler } from "next";
import db from "../../db/db";

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

/**
 * POST /api/review
 *
 * Your API must return receive data in this format.
 */
interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

/**
 * POST /api/review
 *
 * Your API must return a response in this format.
 */
interface CreateReviewResponse {
  success: boolean;
  review: Review;
}

/**
 * GET /api/review
 *
 * Gets a list of reviews for a product
 *
 * Your API must return receive data in this format.
 */
interface GetReviewsQuery {
  productId: string;
}

/**
 * GET /api/review
 *
 * Gets a list of reviews for a product
 *
 * Your API must return a response in this format.
 */
interface GetReviewsResponse {
  success: boolean;
  reviews: Review[];
}

const reviewEndpointHandler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const query = req.query;
    const { productId } : GetReviewsQuery  = query;
    const result = (await db.query(`SELECT * FROM "review" where product_id = ${productId}`)) as Review[];
    const response: GetReviewsResponse = {
      success:true,
      reviews: result,
    };

    res.status(200).json(response);
  }
  else if (req.method === "POST") {

    const {productId, rating, comment} : CreateReviewData = req.body;
    const ratingNumber = parseInt(String(rating))

    if(!comment){
      return res.status(400).json({error: "Empty Review"});
    }

    console.log(rating, res);
    if( Number.isNaN(ratingNumber) ||!ratingNumber || ratingNumber < 1 || ratingNumber > 5 ){
      return res.status(400).json({error: "Invalid Rating"});
    }
    if(!productId){
      return res.status(400).json({error: "Invalid Product"});
    }

    const result = await db.query(`INSERT INTO review (comment, rating, product_id) values ('${comment}' , ${ratingNumber}, ${productId}) RETURNING *`)
    console.log( "Result",result)
    const response: CreateReviewResponse = {
      success:true,
      review: result[0],
    };
    res.status(200).json(response);
  }

  else{
    return res.status(405).end();
  }
};

export default reviewEndpointHandler;
