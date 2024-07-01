Meteor.publish('airdrops/getLiveAirdrops', () => {
    return Airdrops.find({
        isLive: true,
    })
})

Meteor.publish('airdrops/getByContractAddress', (contractAddress) => {
    check(contractAddress, String);

    return Airdrops.find({
        contractAddress,
    });
})