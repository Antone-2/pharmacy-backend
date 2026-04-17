import FAQ from '../models/FAQ.js';

const defaultFaqs = [
  { question: 'What are your operating hours?', answer: 'Monday to Saturday 8AM-8PM, Sunday 9AM-5PM.', order: 0 },
  { question: 'Do you offer home delivery?', answer: 'Yes, we deliver within Lutonyi Parish.', order: 1 },
  { question: 'Can I request a prescription refill?', answer: 'Yes, request a callback and we will assist.', order: 2 },
  { question: 'Do you accept insurance?', answer: 'We accept most major insurance plans.', order: 3 },
  { question: 'Are your pharmacists licensed?', answer: 'Yes, all pharmacists are licensed.', order: 4 },
];

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json(faqs.length > 0 ? faqs : defaultFaqs);
  } catch (error) {
    res.json(defaultFaqs);
  }
};

export const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};