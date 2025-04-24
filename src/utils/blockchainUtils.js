import Web3 from 'web3';

// Import the ABI directly into the code
const CarbonCreditsABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "carbonCredits",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "co2Saved",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "CarbonCreditRecorded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "farmerRecords",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      }
    ],
    "name": "getFarmerRecordCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      }
    ],
    "name": "getFarmerRecordIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "practiceName",
        "type": "string"
      }
    ],
    "name": "getPracticeValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      }
    ],
    "name": "getRecordBasicInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "carbonCredits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "co2Saved",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "carbonCredits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "co2Saved",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "practiceNames",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "practiceValues",
        "type": "uint256[]"
      }
    ],
    "name": "recordCarbonCredits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recordCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "records",
    "outputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "carbonCredits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "co2Saved",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const CARBON_CREDITS_CONTRACT_ADDRESS = '0x7D1013e56Dd68bf34D8dABa5fafE8b1b69137675'; // Replace after deployment

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're connected to Sepolia
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Sepolia chainId is 0xaa36a7 (in decimal: 11155111)
      if (chainId !== '0xaa36a7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                  }
                ]
              });
            } catch (addError) {
              console.error('Error adding Sepolia network:', addError);
              throw new Error('Could not add Sepolia network. Please add it manually in your wallet.');
            }
          } else {
            console.error('Error switching to Sepolia network:', switchError);
            throw new Error('Could not switch to Sepolia network. Please make sure you have Sepolia configured in your wallet.');
          }
        }
      }
      
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  } else {
    throw new Error('Ethereum wallet not detected. Please install MetaMask or another Web3 wallet.');
  }
};

export const initWeb3 = async () => {
  let web3Instance;
  
  if (window.ethereum) {
    web3Instance = new Web3(window.ethereum);
  } else if (window.web3) {
    web3Instance = new Web3(window.web3.currentProvider);
  } else {
    throw new Error('No Ethereum provider detected. Please install MetaMask.');
  }
  
  return web3Instance;
};

export const getContractInstance = async () => {
  const web3 = await initWeb3();
  return new web3.eth.Contract(
    CarbonCreditsABI,
    CARBON_CREDITS_CONTRACT_ADDRESS
  );
};

export const saveCarbonCreditsToBlockchain = async (username, credits, co2Saved, practiceDetails) => {
  try {
    const web3 = await initWeb3();
    let accounts = await web3.eth.getAccounts();
    
    if (accounts.length === 0) {
      const account = await connectWallet();
      accounts = [account];
    }
    
    const contract = await getContractInstance();
    
    // Convert values for the contract
    const carbonCreditsValue = Math.round(credits * 100); // Convert to integer with 2 decimal places
    
    // Extract practice names and values for the contract
    const practiceNames = [];
    const practiceValues = [];
    
    for (const [key, value] of Object.entries(practiceDetails)) {
      practiceNames.push(key);
      practiceValues.push(Math.round(value));
    }
    
    // Call the contract function
    const result = await contract.methods
      .recordCarbonCredits(
        username,
        carbonCreditsValue,
        Math.round(co2Saved),
        practiceNames,
        practiceValues
      )
      .send({ from: accounts[0] });
    
    return {
      success: true,
      txHash: result.transactionHash,
      recordId: result.events.CarbonCreditRecorded.returnValues.recordId,
      blockNumber: result.blockNumber
    };
  } catch (error) {
    console.error('Error saving to blockchain:', error);
    throw error;
  }
};

// Function to get farmer's carbon credit records
export const getFarmerRecords = async (farmerAddress) => {
  try {
    const contract = await getContractInstance();
    
    // Get all record IDs for the farmer
    const recordIds = await contract.methods.getFarmerRecordIds(farmerAddress).call();
    
    // Fetch details for each record
    const records = await Promise.all(recordIds.map(async (recordId) => {
      const basicInfo = await contract.methods.getRecordBasicInfo(recordId).call();
      
      return {
        recordId: recordId,
        farmer: basicInfo.farmer,
        username: basicInfo.username,
        timestamp: basicInfo.timestamp,
        carbonCredits: basicInfo.carbonCredits / 100, // Convert back from the stored integer
        co2Saved: basicInfo.co2Saved
      };
    }));
    
    return records;
  } catch (error) {
    console.error('Error fetching farmer records:', error);
    throw error;
  }
};

// Function to get record details including practices
export const getRecordDetails = async (recordId) => {
  try {
    const contract = await getContractInstance();
    
    // Get basic record info
    const basicInfo = await contract.methods.getRecordBasicInfo(recordId).call();
    
    // Note: To get practice details, you would need to know the practice names
    // This would typically come from your application's configuration or another source
    // For example:
    // const knownPractices = ['no-till', 'cover-crops', 'crop-rotation'];
    // const practiceValues = await Promise.all(knownPractices.map(practiceName => 
    //   contract.methods.getPracticeValue(recordId, practiceName).call()
    // ));
    
    return {
      recordId: recordId,
      farmer: basicInfo.farmer,
      username: basicInfo.username,
      timestamp: new Date(basicInfo.timestamp * 1000), // Convert timestamp to Date
      carbonCredits: basicInfo.carbonCredits / 100, // Convert back from the stored integer
      co2Saved: basicInfo.co2Saved
      // practices: Object.fromEntries(knownPractices.map((name, index) => [name, practiceValues[index]]))
    };
  } catch (error) {
    console.error('Error fetching record details:', error);
    throw error;
  }
};

export const getBlockExplorerUrl = (txHash) => {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
};

// Get total number of records in the system
export const getTotalRecordCount = async () => {
  try {
    const contract = await getContractInstance();
    return await contract.methods.recordCount().call();
  } catch (error) {
    console.error('Error getting record count:', error);
    throw error;
  }
};