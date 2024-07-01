Template.home.helpers({
    hasAlreadyClaimed: (contractAddress) => {
        return Claims.findOne({
            contractAddress,
            address: Session.get('connectedAddress'),
        });
    },

    liveAirdrops: () => {
        const isWalletConnected = Session.get('connectedStatus');
        if (isWalletConnected) {
            return Airdrops.find().fetch().sort((a, b) => {
                if (a.ownerAddress === Session.get('connectedAddress')) return -1;
                if (b.ownerAddress === Session.get('connectedAddress')) return 1;
                return 0;
            });
        }
        return Airdrops.find().fetch();
    },

    hasAirdrops: () => {
        return Airdrops.find().fetch().length > 0;
    },
})

Template.home.events({
    'click .viewAirdrop': (event) => {
        console.log('clicked!')
    },
});