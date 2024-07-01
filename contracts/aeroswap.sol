//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Future Plan - Using NFTs as Airdrop Projects
interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Airdropper {

//State Variables - For Each Airdropper
	address public creator;
	address public airdropOwner;
	address public nftAddress;
	
	//------------------------------------------------
	
	//Mappings AirdropProject: 
	mapping(uint256 => AirdropProject) public projectIds;
	mapping(uint256 => bool) public projectIsActive;
    mapping(uint256 => address) public projectCreator;
    mapping(uint256 => uint256) public projectDepositAmount;
	mapping(uint256 => bool) public projectReleaseforClaim;
	//mapping(uint256 => airdropClaimers) public projectAirdropClaimers;
	mapping(uint256 => mapping(address => bool)) public projectAirdropClaimers;
	//mapping - Project ID -> Claimer -> Payment Status
	mapping(uint256 => mapping(address => bool)) public projectAirdropClaimersPayment;

	//Structure for ProjectClaimers
	struct AirdropProject {
		uint256 airdropProjectID;
		address airdropCreator;
		//string projectName;
		uint256 amount;
		bool openforClaim;	
	}

	//Auto generate Project ID / NFT ID - Starting from 0 
	uint256 projectIDITerator = 0; 

	AirdropProject[] public airdropProjects;

	constructor() {
		creator = msg.sender;
	}

	//Structure for ProjectClaimers
	struct AirdropProjectClaimer {
		uint256 airdropProjectID;
		address claimer;
		bool worldCoinIDVerified;
		string worldCoinProof;
		bool claimStatus;	
	}
	AirdropProjectClaimer[] public airdropClaimers;

	//mapping - Project ID -> Claimer -> Payment Status
	mapping(uint256 => mapping(address => bool)) public projectClaimerWorldCoinCheckStatus;
	
	//------------------------------------------------
	//Modifiers - Check Roles for Individual Creators
    modifier onlyAirdropCreator(uint256 _nftID) {
        require(msg.sender == projectCreator[_nftID], "Only Airdrop Creator can call this method");
        _;
    }
	modifier onlyAirdropClaimer(uint256 _nftID) {
		require(projectAirdropClaimers[_nftID][msg.sender] == true , "Only Airdrop Claimer can call this method");
		_;
	}
	
	//------------------------------------------------

	//Function - Airdrop Creator - Create Airdrop
	function createAirdrop(
		//string name,
		uint256 _amount
	) public {

		//Iterator Increment
		projectIDITerator= airdropProjects.length + 1; 
		
		//Push to Mapping / Struct
		 airdropProjects.push(
			AirdropProject(
				projectIDITerator, //airdropProjectID
				msg.sender, //airdropCreator
				//name, //projectName
				_amount, //amount
				false //openforClaim

				)
			);
		//Push Mappings 
		projectIds[projectIDITerator] = airdropProjects[airdropProjects.length-1];
		projectIsActive[projectIDITerator] = true;
		projectCreator[projectIDITerator] = msg.sender;
		projectDepositAmount[projectIDITerator] = _amount;
		projectReleaseforClaim[projectIDITerator] = false;
	}

	//Function - Airdrop Creator - Deposit Airdrop Amount only Creator can deposit
	function depositAirDropAmount(uint256 _nftID) public payable onlyAirdropCreator(_nftID) {
        require(msg.value >= projectDepositAmount[_nftID]);
		require(projectCreator[_nftID]== msg.sender);
    }

	//Function - Airdrop Creator - Add Claimer Address to Airdrop
	function addClaimerAddresstoAirdrop(uint256 _nftID, address claimerAddress) public onlyAirdropCreator(_nftID){
		//Push to Claimer for Project

	}

	//Function - Airdrop Creator - Open Airdrop for Claim with a specific project
	function releaseForAirdrop(uint256 _nftID) public onlyAirdropCreator(_nftID)  {
		require(projectCreator[_nftID]== msg.sender);
		require(projectDepositAmount[_nftID] > 0);
		projectReleaseforClaim[_nftID] = true;
    }

	//Function - Claimer - WorldCoin ID Check
	function updateWorldCoinIDCheck (uint256 _nftID, bool checkStatus) public onlyAirdropClaimer(_nftID) {
		require(projectAirdropClaimers[_nftID][msg.sender]==true);
		projectClaimerWorldCoinCheckStatus[_nftID][msg.sender] = checkStatus;
	}

	//Function - Claimer - Claim Airdrop
	function claimAirDrop(uint256 _nftID, uint amount) public onlyAirdropClaimer( _nftID) {
		//require world idcheck to be confirmed / check current claim status is false 
		require(projectClaimerWorldCoinCheckStatus[_nftID][msg.sender]==true);

		//escrow amount pay - amount captured in storage
		require(projectReleaseforClaim[_nftID] == true);

		//transfer from smart contract to seller - release funds 
        (bool success, ) = payable(msg.sender).call{value: amount}(
            ""
        );
        require(success);
	}

	//--------------------------------------------------------
	//Allow Contract To Receive Funds
	receive() external payable{}

	//Emergency Release
    modifier onlyOwner() {
        require(msg.sender == creator);
        _;
    }

    function withdraw() external onlyOwner {
        payable(creator).transfer(address(this).balance);
    }

}