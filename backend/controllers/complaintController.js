const Complaint = require("../models/Complaint");

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { orderId, customerId, customerName, restaurantName, message } = req.body;

    if (!orderId || !customerId || !customerName || !message) {
      return res.status(400).json({ message: "Missing complaint details" });
    }

    const complaint = new Complaint({
      orderId,
      customerId,
      customerName,
      restaurantName,
      message
    });

    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    if (!resolution) {
      return res.status(400).json({ message: "Resolution details are required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolution: resolution
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
