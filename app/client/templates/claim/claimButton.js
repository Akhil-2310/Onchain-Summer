import { errorToast, infoToast, successToast } from '../../../imports/client/Toaster';
import { getIdVerificationStatus, doWorldIdVerification } from '/imports/client/WorldIdWrapper';


Template.claimButton.helpers({
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

Template.claimButton.events({
  'click #verifyId': (event) => {
    console.log('Starting ID verify')
    doInitWorldId();
  },

  'click #claimAirdrop': async (event) => {
    event.preventDefault();

    $('#claimAirdrop').prop('disabled', true);

    const address = Session.get('connectedAddress');
    const sessionId = Session.get('connectedSessionId');
    const contractAddress = Router.current().params.airdropContractAddress;
    infoToast('Claim in progress');
    console.log('Claiming airdrop');
    Meteor.call('claims/makeClaim', { address, sessionId, contractAddress }, (err, res) => {
      $('#claimAirdrop').prop('disabled', false);
      if (err) {
        errorToast(err.message);
      } else if (res) {
        successToast('Claim submitted. Please wait for onchain confirmation');
      }
    })
  }
})