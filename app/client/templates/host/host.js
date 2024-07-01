import { errorToast, successToast } from "../../../imports/client/Toaster";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Abi from './abi.json';


            

Template.host.helpers({
    getRandomNumber: () => {
        return Math.floor(Math.random() * 10000000) + 1;
    },

    getUnlimitUrl: () => {
        const MERCHANT_ID = Meteor.settings.public.UNLIMIT_MERCHANT_ID;
        const url = new URL('https://onramp-sandbox.gatefi.com/');
        url.searchParams.append('merchantId', MERCHANT_ID);
        url.searchParams.append('walletLock', true);
        url.searchParams.append('walletAddress', Session.get('connectedAddress'));
        url.searchParams.append('cryptoCurrency', 'ETH');
        url.searchParams.append('cryptoCurrencyLock', true);
        return url.href;
    },
});

Template.host.events({ 
    'submit #createAirdrop': async (event) => {
        event.preventDefault();

        if (!Session.get('connectedStatus')) {
            errorToast('Please connect your wallet first');
            return;
        }

        $('.submitBtn').prop('disabled', true);
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const contractAddress = document.getElementById('contractAddress').value;


   console.log(name);


            Meteor.call('airdrops/create', {
                name, description, amount, contractAddress,
                ownerAddress: Session.get('connectedAddress'),
                sessionId: Session.get('connectedSessionId'),
            }, (err, res) => {
                $('.submitBtn').prop('disabled', false);
                if (err) {
                    errorToast(err.message)
                } else if (res) {
                    successToast('Created new airdrop')
                    Router.go('claim', { airdropContractAddress: contractAddress })
                }
            })

            const web3Modal = new Web3Modal();
        
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            console.log(signer);
            const contract = new ethers.Contract("0x11f71800F9Dfc9cE0a96a93f8bd9907038B0503c", Abi, signer);
            console.log(contract)
            const tx = await contract.storeAirdrop(name,contractAddress,amount);
            console.log(tx);
            const tx1 = await contract.getAirdrop();
           
            console.log(tx1);   

    }
});