import './App.css';
import './main.css'
import { ethers } from "ethers";
import { useState } from 'react';
import ABI from './ABI.json'


function App() {
  // declaration
  const contractAddress = "0xbc9a5c7bEA09AcDD3c8C70e6B9a795b73dbD2FF1"
  const [userList, setUserList] = useState([])
  const [messageList, setMessageList] = useState([])
  const [contract, setContract] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [addressOnOtherSide, setAddressOnOtherSide] = useState('')

  // functions
  const loginWithMetaMask = async () => {
    // fecth contract to start interacting with blockchain
    // provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const address = await provider.send("eth_requestAccounts", []);
    setWalletAddress(address[0])
    // signer
    const signer =  provider.getSigner()
    // contract
    const messengerContract = new ethers.Contract(contractAddress,ABI , signer);
    console.log(messengerContract);
    setContract(messengerContract)

    // get users
    const users = await messengerContract.getUser()
    setUserList(users)
    console.log('users are: ', users);
    
    // check if user is already included

    for (let index = 0; index < users.length; index++) {
      console.log('bic check', users[index][1], address[0]);
      if (users[index][1].toUpperCase() === address[0].toUpperCase()) {
        return
      }

    }
    // add user to blockchain
    await messengerContract.addUser()

  }

  const getMessage = async(userAddress) => {
    setMessageList([])
    const result = await contract.getMessage(userAddress)
    console.log('message resulut is: ', result);
    setMessageList(result)
  }

  const sendMessage = async () => {
    if(addressOnOtherSide === ''){
      console.log('no address selected');
      return
    }
    const result = await contract.addMessage(addressOnOtherSide, inputValue)
    setInputValue('')
    console.log('meesaage added result:', result);
  }


  return (
    <div className="App">
      {/* header */}
      <div className='header-box'>
        <button onClick={loginWithMetaMask} className='button-login' >{walletAddress ? <>{walletAddress}</> : <>Login with metamask</>}</button>
      </div>

      <div className='user-box'>
        {/* sidebar */}
        <div className='siderbar'>
          User List
          < hr />
          {userList.map(user => (<p onClick={() => {getMessage(user[1]);setAddressOnOtherSide(user[1])}}  className='user-box' >{user[1].slice(0, 6)}...{user[1].slice(user[1].length-4, user[1].length)}</p>))}
        </div>
        {/* message box */}
        <div className='message-box'>
          <div className='message-list'>
            message list
            <hr />
            {messageList.map(message => (<p style={{padding:'14px', textAlign: message.sender.toUpperCase() === walletAddress.toUpperCase() ? 'right' : 'left' }} >{message[3]}</p>))}
          </div>
          <div className='message-writing-box'>
              <input className='input' value={inputValue} onChange={e => setInputValue(e.target.value)}  />
              <button onClick={sendMessage} className='submit-button' type='submit' >send</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
