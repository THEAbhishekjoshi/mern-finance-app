import express from 'express'
const router = express.Router();
router.use(express.json())
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
//Plaid Client 
const plaidClient = new PlaidApi(config);

//Generate link_token
router.post('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique-user-id' },
      client_name: 'Finance Manager',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Generate public_token -> access_token
router.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/accounts', async function (request, response, next) {
  const { accessToken } = request.body;
  try {
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    //ffconsole.log(accountsResponse)
    response.json(accountsResponse.data);
  } catch (error) {
    //prettyPrintResponse(error);
    return response.json(error);
  }
});


//to get transcation --/transaction/get/
router.post('/transaction', async function (request, response, next) {
  const { accessToken, timePeriod } = request.body;
  // Set cursor to empty to receive all historical updates
  let cursor = null;

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;

  while (hasMore) {
    const request = {
      access_token: accessToken,
      cursor: cursor,
    };
    const response = await plaidClient.transactionsSync(request)
    const data = response.data;
    cursor = data.next_cursor;
    if (cursor === "") {  //wait for the data 
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }
    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);
    hasMore = data.has_more;
  }
  // const now = new Date();
  // const fromDate = new Date(now.setDate(now.getDate() - timePeriod));
  // const filtered = added.filter((ele) => new Date(ele.date) > fromDate);


  const compareTxnsByDateAscending = (a, b) => (a.date > b.date) - (a.date < b.date);
  // Return the 8 most recent transactions
  //const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-8);
  //const recently_added = [...added].sort(compareTxnsByDateAscending);
  
  const recently_added = [...added].sort(compareTxnsByDateAscending);

  response.json({ latest_transactions: recently_added });

})

export default router;