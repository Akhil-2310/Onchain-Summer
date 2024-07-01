import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Dataconsumerv3 from "/imports/api/abi/Dataconsumerv3.json";

const priceFeed = async (event) => {
    event.preventDefault();
    const contractAddressUSD = '0xdC6a8E15ad8617596E4467F36D93Af24E1d6160f'
    const contractAddressETH = '0x09b61578152B7033A2E4B167748F77c3504797b9'
    
    const contract1ABI_USD = Dataconsumerv3;
    const contract1ABI_ETH = Dataconsumerv3;

    // ABI of your contract
    const privateKey = '4c4dc9b4edbb8c4430e782db0ba161a38a1a705d9a246ac6c16d937bd73d35fd';
    const rpcURL = 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public ';

    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractUSD = new ethers.Contract(contractAddressUSD,contract1ABI_USD, wallet);
    const contractETH = new ethers.Contract(contractAddressETH,contract1ABI_ETH, wallet);


    if(!contractUSD) return;
    try{
        sendTx1 = await contractUSD.getChainlinkDataFeedLatestAnswer( );
          const receiptUSD = await sendTx1.wait();
          console.log(receiptUSD)
    }
    catch (error) {
        console.error('Error calling contract function:', error);
    }

    if(!contractETH) return;
    try{
        sendTx2 = await contractETH.getChainlinkDataFeedLatestAnswer( );
          const receiptETH = await sendTx2.wait();
          console.log(receiptETH)
    }
    catch (error) {
        console.error('Error calling contract function:', error);
    }

};