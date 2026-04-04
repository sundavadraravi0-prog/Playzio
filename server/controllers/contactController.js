// @desc    Submit contact form
// @route   POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Name, email, and message are required');
    }

    // In production, send email here. For now, just log and respond.
    console.log('Contact form submission:', { name, email, subject, message });

    res.json({ message: 'Thank you for your message! We\'ll get back to you soon.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };
