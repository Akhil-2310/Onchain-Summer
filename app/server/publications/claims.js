Meteor.publish('claims/getClaimsByAddress', ({ address, contractAddress }) => {
    check(address, String);
    check(contractAddress, String);

    return Claims.find({
        address,
        contractAddress,
    });
});

Meteor.publish('claims/getClaimsByUser', ({ address, sessionId }) => {
    check(address, String);
    check(sessionId, String);

    // Validate owner
    const owner = Claimers.findOne({
        address: address,
        sessionId,
    });

    if (!owner) {
        return [];
    }

    return Claims.find({
        address,
        hasClaimed: true,
    })
})