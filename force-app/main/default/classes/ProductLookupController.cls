public without sharing class ProductLookupController {

    @AuraEnabled(cacheable=true)
    public static Product2 lookup(String productId) {
        final List<Product2> products = [SELECT Id,Name,ProductCode,Description,IsActive,DisplayUrl FROM Product2 WHERE ProductCode =: productId];
        if (products.size() == 1) return products[0];
        return null;
    }

}