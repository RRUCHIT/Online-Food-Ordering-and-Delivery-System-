const Order = require("../models/Order");
const User = require("../models/User");

exports.getRevenueStats = async (req, res) => {
  try {
    const orders = await Order.find();
    const users = await User.find();

    const totalOrders = orders.length;
    const totalUsers = users.length;
    const activeCustomers = users.filter((u) => u.role === "customer").length;

    const deliveredOrders = orders.filter((o) => o.status === "delivered");

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const platformProfit = deliveredOrders.reduce(
      (sum, order) => sum + (Number(order.total) * 0.15),
      0
    );

    const restaurantRevenue = totalRevenue - platformProfit;

    const completionRate =
      totalOrders === 0
        ? 0
        : (deliveredOrders.length / totalOrders) * 100;

    res.json({
      totalOrders,
      totalUsers,
      activeCustomers,
      totalRevenue,
      platformFee: platformProfit,
      platformProfit,
      restaurantRevenue,
      completionRate
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
