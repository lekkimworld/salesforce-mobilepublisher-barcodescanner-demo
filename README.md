# Salesforce Mobile Publisher Barcode Scanner Demo #
Simple Mobile Publisher demo with a barcode scanner component to be embedded in an Experience Cloud site (Aura for now, LWR doesn't seem to work as of June 2022). The component scans the barcode and looks up a product from the Product2 object based on Product Code in the barcode. Images for the products are retrieved from the static resource.

To configure:
1. Create Experience Cloud Site, set member Profile, make active, add component and publish site 
2. Import / create products
3. Ensure profile has access to the `ProductLookupController` Apex class
4. Create Account and Contact/PersonAccount and User record with Profile

## Resources ##
* Preview Your Mobile Experience Cloud Site with the Publisher Playground App (Beta) (https://help.salesforce.com/s/articleView?id=sf.branded_apps_playground.htm&type=5)
* Enable Biometric ID App Unlock for iOS and Android (https://help.salesforce.com/s/articleView?id=sf.branded_apps_biometric_id_ios_android.htm&type=5)
* Set Time Value for Biometric ID App Unlock (https://help.salesforce.com/s/articleView?id=sf.branded_apps_biometric_id_ios_android_time.htm&type=5)
