Meteor.methods({
    'claimers/setSession': ({ address, sessionId }) => {
        check(address, String);
        check(sessionId, String);

        const claimer = Claimers.findOne({
            address,
        });

        if (!claimer) {
            Claimers.insert({
                address,
                sessionId,
            });
            return 'Done';
        }

        Claimers.update({
            address,
        }, {
            $set: { sessionId },
        });

        return 'Done';
    },

    'claimers/updateVerificationStatus': ({ address, sessionId, worldcoinResponse }) => {
        check(address, String);
        check(sessionId, String);
        check(worldcoinResponse, Object);

        console.log('Worldcoin resp');
        console.log(worldcoinResponse)

        const claimer = Claimers.findOne({
            address,
            sessionId,
        });

        if (!claimer) {
            console.error('Unable to find claimer for verification')
            throw new Meteor.Error('Claimer not found')
        }

        // TODO: Store the worldcoin proof on chain
        

        const updateClaimer = Claimers.update({
            address,
            sessionId,
        }, {
            $set: {
                idVerified: true,
                worldcoinId: worldcoinResponse,
                verifiedAt: new Date(),
            }
        });

        if (updateClaimer === 0) {
            throw new Meteor.Error('Failed to update claimer')
        }

        return 'Successfully updated claimer';
    },
})