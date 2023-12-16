import { BarcodeScanner } from '@capacitor-community/barcode-scanner'

export const getPartyIdFromQRCodeLink = (qrCodeLink: string) => {
    // Use URLSearchParams to parse the remaining URL and get the "id" parameter
    const url = new URL(qrCodeLink)
    const partyId = url.searchParams.get('id')

    return partyId;
}

export const didUserGrantPermission = async () => {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
        // user granted permission
        return true;
    }

    if (status.denied) {
        const c = confirm('We need your permission to use your camera to be able to scan barcodes');
        if (c) {
            BarcodeScanner.openAppSettings();
        } else {
            return false
        }
    }

    if (status.asked) {
        // system requested the user for permission during this call
        // only possible when force set to true
    }

    if (status.neverAsked) {
        // user has not been requested this permission before
        // it is advised to show the user some sort of prompt
        // this way you will not waste your only chance to ask for the permission
    }

    if (status.restricted || status.unknown) {
        // ios only
        // probably means the permission has been denied
        const c = confirm('We need your permission to use your camera to be able to scan barcodes');
        if (c) {
            BarcodeScanner.openAppSettings();
        } else {
            return false
        }
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });

    if (statusRequest.granted) {
        // the user did grant the permission now
        return true;
    }

    // user did not grant the permission, so he must have declined the request
    return false;
};