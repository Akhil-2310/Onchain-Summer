// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

contract Airdrop {
    struct Airdrop_Info {
        string name;
       address recepient;
       uint256 amount ;
      
    }
 

  mapping(address => bytes) proofs;

    event ProofStored(address indexed user, bytes proof);
    event ProofRetrieved(address indexed user, bytes proof);


    mapping(address => Airdrop_Info) public AirdropInfo;
   bool status;


    event AirdropStored(address user, string name, address recepient, uint256 amount );

    function storeAirdrop (string memory name, address recepient, uint256 amount)  external payable  {
       
       

        AirdropInfo[msg.sender] = Airdrop_Info({
            name: name ,
            recepient: recepient,
            amount: amount 
          
        });

        emit AirdropStored(msg.sender,name ,recepient, amount );


    }

     function storeProof(bytes memory _proof) public payable {
        proofs[AirdropInfo[msg.sender].recepient] = _proof;
        emit ProofStored(msg.sender, _proof);
        status= true;
    }


    function getAirdrop() external view returns (Airdrop_Info memory) {
    //string memory, uint256, address

   //Airdrop_Info memory data = AirdropInfo[msg.sender];
    //return (data.name, data.recepient, data.amount);

    return AirdropInfo[msg.sender];
}

    function getProof() public view returns (bytes memory) {
        return proofs[msg.sender];
    }


    //Allow Contract To Receive Funds
}
