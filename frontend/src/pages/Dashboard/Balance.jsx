import { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaUser, FaCreditCard, FaExchangeAlt, FaUsers, FaCogs, FaSignOutAlt, FaQuestionCircle, FaChartBar } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import B1 from '../../components/B1';
import { useDispatch, useSelector } from 'react-redux';
import { addPlaidAccount, resetPlaidAccounts, setPlaidAccounts } from '../../features/plaidAccount/plaidAccountInfoSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function BalancePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [link, setLink] = useState(false)
  const dispatch = useDispatch();
  const fullName = useSelector((state) => state.registration.register.fullname);
  const [accountsInfo, setAccountsInfo] = useState(null);
  const store = useSelector((state) => state.plaidAccountInfo.accounts);
  const accessToken= store.accessToken
  

  //console.log("This is :",store)

  // not working for now 
  // const renderCards = () => {
  //   let totalAccountsSoFar = 0;
  //   return store.map((bank, mark) => {
  //     const bank_name = bank.institution_name;
  //     const cards = bank.accountList.map((account, index) => (
  //       <BalanceCard
  //         key={`${mark}-${index}`}
  //         title={`Account ${index + 1 + totalAccountsSoFar}`}
  //         currency={account?.iso_currency_code || 'USD'}
  //         flag="🏦"
  //         amount={`$${account?.balances?.current || '0.00'}`}
  //         bankName={bank_name}
  //         change="15.43% Than last month"
  //       />
  //     ));
  //     totalAccountsSoFar += bank.accountList.length;
  //     return cards;
  //   });
  // };
  const handleLink = () => {
    setLink(!link);
  }

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} relative`}>
        <div className="flex justify-between items-center p-4">
          {isSidebarOpen && <h1 className="font-bold text-lg">LOGO</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-xl">
            <IoIosArrowBack className={`transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className="mt-4 space-y-2">
          <SidebarItem icon={<FaChartBar />} label="Dashboard" isOpen={isSidebarOpen}  path="/dashboard"/>
          <SidebarItem icon={<FaCreditCard />} label="Balance" isOpen={isSidebarOpen} active />
          <SidebarItem icon={<FaExchangeAlt />} label="Cards" isOpen={isSidebarOpen} />
          <SidebarItem icon={<FaUsers />} label="Transactions" isOpen={isSidebarOpen} />
          <SidebarItem icon={<FaUser />} label="Recipients" isOpen={isSidebarOpen} />
          <div className="border-t my-2" />
          <SidebarItem icon={<FaCogs />} label="Integrations" isOpen={isSidebarOpen} />
          <SidebarItem icon={<FaSignOutAlt />} label="Settings" isOpen={isSidebarOpen} />
          <SidebarItem icon={<FaQuestionCircle />} label="Get Help" isOpen={isSidebarOpen} />
        </nav>
        <div className="absolute bottom-4 w-full px-4">
          {isSidebarOpen && (
            <div className="text-sm border rounded p-2">
              <p className="font-medium">Need Support?</p>
              <p className="text-xs text-gray-500 mb-1">contact with one of our experts</p>
              <button className="w-full bg-black text-white text-xs py-1 rounded">Contact Us</button>
            </div>
          )}
          <div className="mt-4 flex items-center space-x-2">
            <img src="https://i.pravatar.cc/30" alt="avatar" className="w-8 h-8 rounded-full" />
            {isSidebarOpen && <span className="text-sm">{fullName}</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Balance</h2>
            <p className="text-gray-500 text-sm">Effortlessly manage and monitor your financial resources with ease</p>
          </div>
          <div className="flex space-x-4">
            <input type="text" className="border rounded px-3 py-1 text-sm" value="8 Feb - 15 Feb 2024" readOnly />
            <button className="border px-3 py-1 text-sm rounded">Filter</button>
            <button className="bg-black text-white px-4 py-1 rounded" onClick={handleLink}>Add Balance</button>
            {link && <B1 />}
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* {store.length > 0 && store[0]?.accountList?.length > 0 && renderCards()} */}
          {/* learn flatMap() */}
          {store.length > 0  && store[0]?.accountList?.length > 0 && (
            store.map((bank, mark) => {
              let bank_name = bank.institution_name;
              let prevAccounts = 0;
              if (mark > 0) {
                prevAccounts += bank.accountList.length
              }
              return bank.accountList.map((account, index) => (
                <BalanceCard
                  key={`${mark}-${index}`}
                  title={`Account ${index + 1 + prevAccounts}`}
                  currency={account?.iso_currency_code || 'USD'}
                  flag="🏦"
                  amount={`$${account?.balances?.current || '0.00'}`}
                  bankName={bank_name}
                  change="15.43% Than last month"
                />
              ));
            })
          )}
        </div>
        {/* Remove Cards Button */}


        {store.length > 0 &&
          <button
            id='removeCards'
            className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition"
            onClick={() => {
              dispatch(resetPlaidAccounts());
              localStorage.removeItem('accountInfo'); // Reset persisted data too
              toast.success("Removed All Cards Successfully!")
            }}
          >
            Remove Cards
          </button>
        }

      </div>
    </div>
  );
}

function SidebarItem({ icon, label, isOpen, active,path }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => path && navigate(path)}
    className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${active ? 'font-semibold' : ''}`}>
      <span className="text-lg mr-3">{icon}</span>
      {isOpen && <span>{label}</span>}
    </div>
  );
}

function BalanceCard({ title, currency, flag, amount, bankName, change }) {
  //console.log("BalanceCard", title, currency, flag, amount, bankName, change);
  return (
    <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E2E8F0] backdrop-blur-md rounded-2xl shadow-lg p-4 border border-white/30 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-sm text-gray-400">More Option</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">{flag} {currency}</div>
      <div className="text-2xl font-bold mb-2">{amount}</div>
      <div className="font-semibold text-sm">{bankName}</div>
      <div className="bg-green-100 text-green-700 text-xs rounded px-2 py-1 inline-block mb-2">{change}</div>
      <button className="w-full border rounded py-1 text-sm">Open</button>
    </div>
  );
}
