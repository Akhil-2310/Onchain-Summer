import moment from 'moment';
import { getIdVerificationStatus } from "../../../imports/client/WorldIdWrapper";
import { errorToast, successToast } from '../../../imports/client/Toaster';

Template.claim.helpers({
    isOwner: () => {
        const airdrop = Airdrops.findOne({ contractAddress: Router.current().params.airdropContractAddress, ownerAddress: Session.get('connectedAddress') });
        return airdrop;
    },

    getReadableDate: (date) => {
        return moment(date).fromNow();
    },

    isWalletConnected: () => {
        return Session.get('connectedStatus');
    },

    getCurrentAirdrop: () => {
        return Airdrops.findOne({ contractAddress: Router.current().params.airdropContractAddress })
    },

    isIdVerified: () => {
        return getIdVerificationStatus();
    },

    existingClaim: () => {
        return Claims.findOne({
            contractAddress: Router.current().params.airdropContractAddress,
            address: Session.get('connectedAddress'),
        });
    }
})

Template.claim.events({
    'click #deleteListing': (event) => {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete this listing?")) {
            event.stopPropagation();
            return;
        }

        $('#deleteListing').attr('disabled', true);

        Meteor.call('airdrops/hideListing', {
            contractAddress: Router.current().params.airdropContractAddress,
            ownerAddress: Session.get('connectedAddress'),
            sessionId: Session.get('connectedSessionId'),
        }, (err, res) => {
            $('#deleteListing').attr('disabled', true);
            if (err) {
                errorToast(err.message)
            } else if (res) {
                successToast('Deleted airdrop listing');
                Router.go('home');
            }
        })
    }
})

Template.claim.onRendered(() => {
    const airdrop = Airdrops.findOne();
    if (!airdrop) {
        errorToast('Airdrop not found');
        Router.go('home');
    }
})