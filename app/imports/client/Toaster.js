import ToasterUi from 'toaster-ui';

const toaster = new ToasterUi();

const errorToast = (message) => {
    toaster.addToast(message, "error");
};

const successToast = (message) => {
    toaster.addToast(message, "success")
}

const infoToast = (message) => {
    toaster.addToast(message, "info")
}

export {
    errorToast,
    successToast,
    infoToast,
};