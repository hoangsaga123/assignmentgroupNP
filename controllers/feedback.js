import { createFeedback } from "../utility/createFeedback.js";

export async function feedback(req, res, next) {
    const productId = req.params.productId;
    res.render('feedbackDetail', { product_id: productId, title: 'feedbackDetail' });
}



export async function createFeedbackSubmit(req, res, next) {
    const user = req.user;

    // Extract data from the request body
    const { feedback_headline, feedback_description, rating_condition, productId } = req.body;

    // Prepare product data to insert into the database
    const newFeedback = {
        feedback_headline,
        feedback_description,
        rating_condition,
        product_id: productId,
        email: user.email
    };



    try {
        // Create the feedback in the database
        await createFeedback(newFeedback);

        // Redirect the user to the home page after successful feedback creation
        return res.redirect(`/product-details/${productId}`);
    } catch (error) {
        console.error('Error creating feedback:', error);

    }
}