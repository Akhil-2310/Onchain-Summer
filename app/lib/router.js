Router.configure({
    layoutTemplate: 'layout',
})

Router.route('/', {
    name: 'home',
    subscriptions: () => {
        Meteor.subscribe('airdrops/getLiveAirdrops');
        const currentAddress = Session.get('connectedAddress');
        const sessionId = Session.get('connectedSessionId')
        if (currentAddress) {
            Meteor.subscribe('claims/getClaimsByUser', {
                address: currentAddress,
                sessionId,
            });
        }
    },
});

Router.route('/claim/:airdropContractAddress', {
    name: 'claim',
    subscriptions: function() {
        const currentAddress = Session.get('connectedAddress');
        const sessionId = Session.get('connectedSessionId')
        
        if (currentAddress) {
            Meteor.subscribe('claimers/getCurrentClaimer', {
                address: currentAddress,
                sessionId,
            });
            Meteor.subscribe('claims/getClaimsByAddress', {
                address: currentAddress,
                contractAddress: this.params.airdropContractAddress,
            });
        }
    },
    waitOn: function () {

        return [
            Meteor.subscribe('airdrops/getByContractAddress', this.params.airdropContractAddress),
        ];
    }
});

Router.route('/host', {
    name: 'host'
});

Router.route('/api/verifyWorldProof', {
    where: 'server'
}).post(function () {
    var requestBody = this.request.body;


    console.log('Received API req')
    console.log(requestBody);

    Meteor.call('claimers/updateVerificationStatus', requestBody);
    this.response.statusCode = 200;
    this.response.end('Verification status updated successfully.');
});

