// Simulate payment processing
export const processPayment = () => {
  return new Promise((resolve) => {
    // In a real app, this would integrate with a payment gateway
    setTimeout(() => resolve(true), 1000);
  });
};