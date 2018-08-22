public with sharing class batchPOC_CTRL {
    //this function returns all DataImport__c records to lightning component
    @AuraEnabled
    public static List<DataImport__c> getDataImports(Id batchId){
        System.debug(batchId);
        List<DataImport__c> myDIs = [SELECT Id
                , Name
                , Contact1_Firstname__c
                , Contact1_Lastname__c
                , Contact1Imported__c
                , Account1Imported__c
                , Donation_Date__c
                , Donation_Amount__c
        FROM DataImport__c WHERE NPSP_Data_Import_Batch__c = :batchId];
        System.debug(myDIs);
        return myDIs;
    }
}