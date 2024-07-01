import { makeClaim } from "../../imports/server/Claimer";

Meteor.methods({
    'claims/makeClaim': ({ address, sessionId, contractAddress }) => {
        check(address, String);
        check(sessionId, String);
        check(contractAddress, String);

        const claimer = Claimers.findOne({
            address,
            sessionId,
        });

        if (!claimer) {
            throw new Meteor.Error('Please reconnect your wallet to claim')
        };

        if (!claimer.idVerified) {
            throw new Meteor.Error('Please verify your World ID to claim');
        }

        // Check if existing claim has been made
        const existingClaim = Claims.findOne({
            contractAddress,
            address,
            hasClaimed: true,
        });

        if (existingClaim) {
            throw new Meteor.Error('You have already claimed this airdrop');
        }

        Async.runSync(function (done) {
            makeClaim(address).then((transactionHash) => {
                Claims.insert({
                    contractAddress, 
                    address,
                    transactionHash,
                    hasClaimed: true, 
                    claimedAt: new Date(),
                })
                return done();
            });
        });
        return 'Claim in progress';
    }
})