const groupTransactionsByMonth = (transactions) => {
  const grouped = {};

  for (const tx of transactions) {
    const date = new Date(tx.date);
    const month = date.toLocaleString("default", { month: "short" }); //Jan 
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!grouped[key]) {
      grouped[key] = { income: 0, expense: 0 };
    }

    if (tx.amount < 0) {
      grouped[key].expense += Math.abs(tx.amount);
    } else {
      grouped[key].income += tx.amount;
    }
  }

  return Object.entries(grouped).map(([month, values]) => ({ //Object.entries ->It turns the object into an array of key-value pairs.
    month,
    ...values,
  }))
 
};
export default groupTransactionsByMonth;