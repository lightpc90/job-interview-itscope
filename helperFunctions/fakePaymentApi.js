const fakePaymentApi = (amount, currency) => {
    currency = 'usd'
    const current_date = new Date()
    const paymentId = `${current_date}-${Math.random()}-${amount}usd`
    return(paymentId)
}