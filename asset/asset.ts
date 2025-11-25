export const dummyAdminDashboardData = {
  products: 1,
  revenue: 1000,
  orders: 2,
  stores: 5,
  allOrders: []
};

export const couponDummyData = [
  {
    code: "WELCOME10",
    description: "10% OFF for new users",
    discount: 10,
    expiresAt: "2025-12-31",
    forNewUser: true,
    forMember: false,
    isPublic: true
  },
  {
    code: "SAVE20",
    description: "20% Members Discount",
    discount: 20,
    expiresAt: "2025-08-01",
    forNewUser: false,
    forMember: true,
    isPublic: false
  }
];
