import { LightningElement, track } from "lwc";
import { getBarcodeScanner } from "lightning/mobileCapabilities";
import templateMobile from "./mobile-template.html";
import templateDesktop from "./desktop-template.html";
import lookup from "@salesforce/apex/ProductLookupController.lookup";
import productImages from "@salesforce/resourceUrl/productimages";

export default class BarcodeScanner extends LightningElement {
    @track scannerAvailable = false;
    myScanner;
    record;
    imageUrl;

    connectedCallback() {
        this.log("enter connectedCallback");
        this.myScanner = getBarcodeScanner();
        this.scannerAvailable = null !== this.myScanner && this.myScanner.isAvailable();
        this.log(`exit connectedCallback - scannerAvailable <${this.scannerAvailable}>`);
    }

    render() {
        return this.scannerAvailable ? templateMobile : templateDesktop;
    }

    handleClear() {
        this.template.querySelector(`lightning-input`).value = "";
        this.imageUrl = undefined;
        this.record = undefined;
    }

    log(msg) {
        console.log(msg);
    }

    handleBeginSearch() {
        this.doSearch();
    }

    handleBeginScanClick() {
        const scanningOptions = {
            barcodeTypes: [
                this.myScanner.barcodeTypes.EAN_13,
                this.myScanner.barcodeTypes.QR,
                this.myScanner.barcodeTypes.DATA_MATRIX
            ]
        };
        this.myScanner
            .beginCapture(scanningOptions)
            .then((result) => {
                // do something with the result of the scan
                const scannedBarcode = decodeURIComponent(result.value);
                this.template.querySelector(`lightning-input`).value = scannedBarcode;
                this.doSearch();
            })
            .catch((err) => {
                // Handle cancelation and scanning errors here
                this.showErrorToast(`Error scanning bar code / QR code due to error: ${err.message}`);
            })
            .finally(() => {
                this.myScanner.endCapture();
            });
    }

    handleKeypress(ev) {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            ev.stopPropagation();
            this.doSearch();
        }
    }

    doSearch() {
        const value = this.template.querySelector(`lightning-input`).value;
        this.log(`Searching for: ${value}`);
        lookup({ productId: value })
            .then((record) => {
                if (!record) throw Error("No product found");
                this.imageUrl = `${productImages}/${record.ProductCode}.jpg`;
                this.record = record;
            })
            .catch(() => {
                this.handleClear();
            });
    }
}
