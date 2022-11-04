# Salesforce Mobile Publisher Barcode Scanner Demo #
Simple Mobile Publisher demo with a barcode scanner component to be embedded in an Experience Cloud site. It needs to be an Aura (Build your Own) for now, LWR (Build your Own) doesn't seem to work as of June 2022. The component scans the barcode and looks up a product from the Product2 object based on Product Code in the barcode. Images for the products are retrieved from the static resource.

To configure:
1. Create Experience Cloud Site, set member Profile, make active, add component and publish site 
2. Import / create products
3. Ensure profile has access to the `ProductLookupController` Apex class
4. Create Account and Contact/PersonAccount and User record with Profile

## Deployment ##
```
sfdx force:org:create -f config/project-scratch-def.json --setdefaultusername
sfdx force:source:push
sfdx force:community:create -t "Build Your Own" -p "mpdemo" -n "Mobile Publisher Demo"

ROLE_ID=`sfdx force:data:soql:query -q "select Id from UserRole where Name='Dummy'" --json | jq ".result.records[0].Id" -r`
sfdx force:data:record:update -s User -w "Name='User User'" -v "LanguageLocaleKey=en_US TimeZoneSidKey=Europe/Paris LocaleSidKey=da UserPreferencesUserDebugModePref=true UserPreferencesApexPagesDeveloperMode=true UserPermissionsInteractionUser=true UserPermissionsKnowledgeUser=true UserRoleId=$ROLE_ID"

sfdx force:org:open -p _ui/networks/setup/SetupNetworksPage
```

## Create demo portal user

```
final String profileName = 'Mobile Publisher Site User';
final String userPassword = 'Salesforce1';
final String timezone = 'Europe/Paris';
final String locale = 'da_DK';
final String actualEmail = 'mheisterberg@salesforce.com';
final String fn = 'John';
final String ln = 'Doe';
final String alias = (fn.toLowerCase().substring(0, 1) + ln.toLowerCase()).substring(0,4) + String.valueOf(DateTime.now().getTime()).reverse().substring(0,4);
final String email = fn.toLowerCase() + '.' + ln.toLowerCase() + '@example.com';

Account a = new Account();
a.Name = 'Foo Corp.';
INSERT a;

Contact c = new Contact();
c.FirstName = fn;
c.LastName = ln;
c.Email = email;
c.AccountId = a.Id;
INSERT c;

Profile p = [SELECT Id FROM Profile WHERE Name =: profileName LIMIT 1];

User u = new User();
u.firstname = fn;
u.lastname = ln;
u.username = email;
u.email = actualEmail;
u.ProfileId = p.Id;
u.Contactid = c.Id;
u.alias = alias;
u.EmailEncodingKey = 'UTF-8';
u.IsActive = true;
u.LanguageLocaleKey = 'en_US';
u.LocaleSidKey = locale;
u.TimeZoneSidKey = timezone;
insert u;

System.setPassword(u.id, userPassword);
```

## Resources ##
* Preview Your Mobile Experience Cloud Site with the Publisher Playground App (Beta) (https://help.salesforce.com/s/articleView?id=sf.branded_apps_playground.htm&type=5)
* Enable Biometric ID App Unlock for iOS and Android (https://help.salesforce.com/s/articleView?id=sf.branded_apps_biometric_id_ios_android.htm&type=5)
* Set Time Value for Biometric ID App Unlock (https://help.salesforce.com/s/articleView?id=sf.branded_apps_biometric_id_ios_android_time.htm&type=5)
