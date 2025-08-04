//amount , merchant_name, logo_url
const recentTransaction = (transactions, trxDays) => {
    const grouped = {}
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - trxDays)
    for (const tx of transactions) {
        if (new Date(tx.date) < fromDate) continue; //skip

        const key = tx.merchant_name || tx.name || "Unknown";
        if (!grouped[key]) {
            grouped[key] = { amount: 0, logo_url: '' }
        }
        grouped[key].amount += tx.amount
        grouped[key].logo_url = tx.logo_url
    }
    console.log("Grouped obj -:",grouped)
    return Object.entries(grouped).map(([platform, values]) => ({ //Object.entries ->It turns the object into an array of key-value pairs.
        platform,
        ...values,
    }))
}

export default recentTransaction;