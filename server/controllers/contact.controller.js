const {
  createContactSubmission,
  markContactSubmissionFailed,
  markContactSubmissionSent
} = require('../services/contact-submission.service');
const { sendContactEmail } = require('../services/email.service');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitContactForm(request, response, next) {
  try {
    const name = String(request.body?.name || '').trim();
    const email = String(request.body?.email || '').trim();
    const message = String(request.body?.message || '').trim();
    let savedToCollection = false;
    let submissionId = null;

    if (!name || !email || !message) {
      const error = new Error('Name, email, and message are required.');
      error.statusCode = 400;
      throw error;
    }

    if (!EMAIL_PATTERN.test(email)) {
      const error = new Error('Please enter a valid email address.');
      error.statusCode = 400;
      throw error;
    }

    if (name.length > 80 || email.length > 120 || message.length > 2000) {
      const error = new Error('Contact form input is too long.');
      error.statusCode = 400;
      throw error;
    }

    try {
      const submission = await createContactSubmission({
        email,
        emailStatus: 'pending',
        message,
        name
      });

      submissionId = submission.id;
      savedToCollection = true;
    } catch (_error) {
      savedToCollection = false;
    }

    try {
      await sendContactEmail({ name, email, message });
    } catch (error) {
      if (savedToCollection && submissionId) {
        try {
          await markContactSubmissionFailed(submissionId, error.message || 'Failed to send contact email.');
        } catch (_updateError) {
          // Keep the original email error as the API response.
        }

        return response.status(202).json({
          message:
            'Your message was saved, but email delivery is unavailable right now. Please verify the SMTP settings before retrying.',
          savedToCollection,
          submissionId,
          emailSent: false
        });
      }

      throw error;
    }

    if (savedToCollection && submissionId) {
      try {
        await markContactSubmissionSent(submissionId);
      } catch (_updateError) {
        // The submission already exists in the collection, so keep the success state.
      }
    }

    response.status(201).json({
      message: 'Your message was sent successfully.',
      savedToCollection,
      submissionId,
      emailSent: true
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitContactForm
};
