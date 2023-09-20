// Simulated payment API call 
async function callPaymentAPI(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful payment
      resolve({ success: true, paymentId: `${Math.random()}.${new Date()}-${amount}usd` });
      // Simulate a failed payment
      // reject(new Error('Payment failed.'));
    }, 1000);
  });
}

module.exports = callPaymentAPI