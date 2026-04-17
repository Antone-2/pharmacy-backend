import HealthTip from '../models/HealthTip.js';

export const getHealthTips = async (req, res) => {
  try {
    const tips = await HealthTip.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
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