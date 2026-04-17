import HealthTip from '../models/HealthTip.js';

const defaultTips = [
  { title: 'Stay Hydrated', content: 'Drink at least 8 glasses of water daily.', category: 'Droplets' },
  { title: 'Eat Balanced Meals', content: 'Include fruits, vegetables, and whole grains.', category: 'Apple' },
  { title: 'Get Enough Vitamin D', content: 'Spend time in morning sunlight.', category: 'Sun' },
  { title: 'Exercise Regularly', content: 'At least 30 minutes of moderate exercise daily.', category: 'Heart' },
];

export const getHealthTips = async (req, res) => {
  try {
    const tips = await HealthTip.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tips.length > 0 ? tips : defaultTips);
  } catch (error) {
    res.json(defaultTips);
  }
};

export const createHealthTip = async (req, res) => {
  try {
    const tip = new HealthTip(req.body);
    await tip.save();
    res.status(201).json(tip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateHealthTip = async (req, res) => {
  try {
    const tip = await HealthTip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHealthTip = async (req, res) => {
  try {
    await HealthTip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Health tip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};