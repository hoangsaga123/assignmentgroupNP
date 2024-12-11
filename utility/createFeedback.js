import sql from '../config/db.js';

export async function createFeedback(feedback) {
    try {
        // SQL query to insert a new product
        await sql`
        INSERT INTO feedback (feedback_headline, feedback_description, rating_condition, product_id, email)
        VALUES (${feedback.feedback_headline}, ${feedback.feedback_description}, ${feedback.rating_condition}, ${feedback.product_id}, ${feedback.email});`;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}