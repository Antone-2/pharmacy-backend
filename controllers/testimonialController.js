import Testimonial from '../models/Testimonial.js';

const defaultTestimonials = [
  { name: 'Mary Akello', role: 'Regular Patient', content: 'The staff at Gamsel Pharmacy are always professional and helpful. They take the time to explain my medications and ensure I understand how to take them correctly.', rating: 5 },
  { name: 'John Wanyama', role: 'Parent', content: 'Whenever my children need medication, I trust Gamsel Pharmacy. Their quick service and genuine advice have been a blessing to our family.', rating: 5 },
  { name: 'Sarah Nabwire', role: 'Community Member', content: 'The callback service is fantastic! I submitted a request and got a call back within minutes. Highly recommend.', rating: 5 },
];

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials.length > 0 ? testimonials : defaultTestimonials);
  } catch (error) {
    res.json(defaultTestimonials);
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};