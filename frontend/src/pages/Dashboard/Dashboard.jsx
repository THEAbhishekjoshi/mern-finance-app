import React, { useEffect, useState } from 'react';
import {
  FaChartBar,
  FaCreditCard,
  FaExchangeAlt,
  FaUsers,
  FaUser,
  FaCogs,
  FaSignOutAlt,
  FaQuestionCircle,
  FaSearch,
  FaBell,
} from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { data, useNavigate } from 'react-router-dom';
import { addTransactionInfo, setTransactionInfo } from '../../features/plaidAccount/plaidAccountInfoSlice';
import axios from 'axios';
import GaugeChart from '../../components/GaugeChart';
import BudgetBarChart from '../../components/BudgetBarChart';
import GeminiChatbot from '../../components/ChatBot';
import groupTransactionsByMonth from '../../components/groupTransactionByMonth'
import recentTransaction from '../../components/RecentTransaction';


const Dashboard = function FinancialDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const [spendAmount, setSpendAmount] = useState(0);
  const [trxDays, setTrxDays] = useState(7);
  const [selectedDays, setSelectedDays] = useState(30); // Default to 30 days
  const fullName = useSelector((state) => state.registration.register.fullname);
  console.log("fulllname:",fullName)
  const [recent, setRecent] = useState([]);
  const [maxIndex, setMaxIndex] = useState(3);





  //Show the Total Balance 
  const account = useSelector((state) => state.plaidAccountInfo.accounts);
  const [myBalance, setMyBalance] = useState(0);
  useEffect(() => {
    if (!account || !Array.isArray(account)) return;

    let total = 0;
    account.forEach((element) => {
      element?.accountList?.forEach((ele) => {
        total += ele?.balances?.available || 0;
      });
    });

    setMyBalance(total);
  }, [account]);

  //
  const accounts = useSelector((state) => state.plaidAccountInfo.accounts)
  let temp_list_transactionData = [];
  useEffect(() => {                              //useEffect doesn't return anything so 
    const fetchTransactions = async () => {
      for (let acc of accounts) {
        try {
          const res = await axios.post("http://localhost:5004/api/transaction", {
            accessToken: acc.accessTokens,
            timePeriod: selectedDays,
          });
          //console.log("response from Api:", res.data);
          //dispatch(addTransactionInfo(res.data.latest_transactions));
          temp_list_transactionData = temp_list_transactionData.concat(res.data.latest_transactions);
        } catch (err) {
          console.error("Error fetching transaction:", err.message);
        }
      }
      dispatch(setTransactionInfo(temp_list_transactionData));

    };
    if (accounts?.length) {
      fetchTransactions();
    }
  }, [accounts, dispatch, selectedDays]);


  const transactions = useSelector((state) => state.plaidAccountInfo.transaction)
  //for Recent Transaction
  useEffect(() => {
    const filtered = transactions ? recentTransaction(transactions, trxDays) : [];
    setRecent(filtered);
  }, [transactions, trxDays]);

  //for Budget Overview
  const grouped = groupTransactionsByMonth(transactions);
  const income = grouped.reduce((acc, curr) => acc + curr.income, 0);
  const expense = grouped.reduce((acc, curr) => acc + curr.expense, 0);
  console.log('income:', income, 'expense:', expense)

  //for Spending Summary
  const fromDate = new Date();         // fresh date object
  fromDate.setDate(fromDate.getDate() - selectedDays);
  useEffect(() => {
    let spending_summary_count = 0;
    for (let trans of transactions) {
      if (trans.amount < 0 && new Date(trans.date) > fromDate) {
        console.log(trans);
        spending_summary_count += Math.abs(trans.amount);
      }
    }
    setSpendAmount(spending_summary_count);
  }, [transactions, selectedDays]);



  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} relative`}>
        <div className="flex justify-between items-center p-4">
          {sidebarOpen && <h1 className="font-bold text-lg">LOGO</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl">
            <IoIosArrowBack className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className="mt-4 space-y-2">
          <SidebarItem icon={<FaChartBar />} label="Dashboard" isOpen={sidebarOpen} active />
          <SidebarItem icon={<FaCreditCard />} label="Balance" isOpen={sidebarOpen} path="/dashboard/balance" />
          <SidebarItem icon={<FaExchangeAlt />} label="Cards" isOpen={sidebarOpen} />
          <SidebarItem icon={<FaUsers />} label="Transactions" isOpen={sidebarOpen} />
          <SidebarItem icon={<FaUser />} label="Recipients" isOpen={sidebarOpen} />
          <div className="border-t my-2" />
          <SidebarItem icon={<FaCogs />} label="Integrations" isOpen={sidebarOpen} />
          <SidebarItem icon={<FaSignOutAlt />} label="Settings" isOpen={sidebarOpen} />
          <SidebarItem icon={<FaQuestionCircle />} label="Get Help" isOpen={sidebarOpen} />
        </nav>
        <div className="absolute bottom-4 w-full px-4">
          {sidebarOpen && (
            <div className="text-sm border rounded p-2 mb-4">
              <p className="font-medium">Need Support?</p>
              <p className="text-xs text-gray-500 mb-1">Contact with one of our experts</p>
              <button className="w-full bg-black text-white text-xs py-1 rounded">Contact Us</button>
            </div>
          )}
          <div className="mt-4 flex items-center space-x-2">
            <img src="https://i.pravatar.cc/30" alt="avatar" className="w-8 h-8 rounded-full" />
            {sidebarOpen && <span className="text-sm">{fullName}</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100 relative">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Financial Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, {fullName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500"><FaSearch /></button>
            <button className="text-gray-500"><FaBell /></button>
            <button className="px-4 py-2 border rounded">Exchange Rate</button>
            <div className="px-4 py-2 bg-white rounded border text-sm">8 Feb - 15 Feb 2024</div>
          </div>
        </header>

        {/* Top Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* My Balance */}
          <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FaCreditCard className="text-blue-600" />
              <span>My Balance</span>
            </div>
            <h3 className="text-2xl font-bold mt-2">${myBalance.toFixed(2)}</h3>
            <div className="text-sm text-green-500 mt-1">15.43% Than last month</div>
            <div className="mt-4 flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded">Send</button>
              <button className="border px-4 py-2 rounded">Request</button>
            </div>
          </div>

          {/* Spending Summary */}
          <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] p-6 rounded-xl shadow-lg flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FaChartBar className="text-blue-600" />
              <span>Spending Summary</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <GaugeChart spentAmount={spendAmount} spendingLimit={2000} />

              <p className="text-xs text-blue-600 mt-3 text-center">
                Your weekly spending limit is <span className="font-medium text-black">$2000</span>
              </p>
              <select
                className="text-sm text-white border py-1 px-2 rounded bg-black mt-4"
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
              >
                <option value={7}>🗓️ Last 7 days</option>
                <option value={30}>🗓️ Last 30 days</option>
                <option value={60}>🗓️ Last 60 days</option>
              </select>
            </div>
          </div>



          {/* My Cards */}
          <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FaExchangeAlt className="text-blue-600" />
                <span>My Cards</span>
              </div>
              <button className="text-blue-600">+ More Option</button>
            </div>
            <div className="mt-4 h-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
          </div>

        </section>

        {/* Bottom Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Budget Overview */}
          <div className="col-span-2 bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaUsers className="text-blue-600" />
                <h3 className="text-lg font-semibold">Budget Overview</h3>
              </div>
              <button className="text-blue-600 text-sm hover:underline">More Options</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <img
                  src="https://img.icons8.com/?size=100&id=39973&format=png&color=000000"
                  alt="Income Icon"
                  className="w-8 h-8"
                />
                <p className="text-sm text-gray-500">Income</p>
                <p className="text-2xl font-bold text-blue-500">${income.toFixed(2)}</p>
              </div>
              <div>
                <img
                  src="https://img.icons8.com/ios-filled/50/circled-up-right.png"
                  alt="Expense Icon"
                  className="w-8 h-8"
                />
                <p className="text-sm text-gray-500">Expense</p>
                <p className="text-2xl font-bold text-slate-800">${expense.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-72 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] rounded-xl p-4 shadow-inner flex items-center justify-center">
              <BudgetBarChart transactions={transactions} />
            </div>
          </div>


          {/* Recent Transactions */}
          <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-600" />
                <span>Recent Transactions</span>
              </div>
              <select
                value={trxDays}
                className="text-sm text-white border py-1 px-2 rounded bg-black"
                onChange={(e) => setTrxDays(Number(e.target.value))}
              >
                <option value={2}>Last 2 days</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>

            {recent && recent.length > 0 ? (
              recent.slice(0, maxIndex).map((tx, idx) => (
                <div key={idx} className="flex items-center mt-2 justify-between  
                  bg-white/30 backdrop-blur-sm hover:bg-white/50
                  p-3 rounded-lg transition">
                  <div className="flex items-center space-x-3">
                    <img
                      src={tx.logo_url || "https://via.placeholder.com/40"}
                      alt={tx.platform}
                      className="w-10 h-10 rounded-full object-cover bg-white border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tx.platform}</p>
                      <p className="text-xs text-gray-500">Merchant</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No recent transactions</p>
            )}
            {maxIndex < 6 ? (
              <button className="mt-4 text-blue-600 text-sm" onClick={() => setMaxIndex(6)}>See All</button>
            ) : (
              <button className="mt-4 text-blue-600 text-sm" onClick={() => setMaxIndex(3)}>See Less</button>
            )}
          </div>

        </section>
        <GeminiChatbot />
      </main>
    </div>
  );
};

function SidebarItem({ icon, label, isOpen, active, path }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => path && navigate(path)}
      className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${active ? 'font-semibold' : ''}`}>
      <span className="text-lg mr-3">{icon}</span>
      {isOpen && <span>{label}</span>}
    </div>
  );
}



export default Dashboard;
