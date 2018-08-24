public with sharing class batchPOC_CTRL {
    //this function returns all DataImport__c records to lightning component
    @AuraEnabled
    public static String getDataImportModel(Id batchId){

        DataImportModel dataImportModel = new DataImportModel();

        dataImportModel.id = batchId;
        dataImportModel.dataImportRows = getDataImports(batchId);
        dataImportModel.columns = getColumns();
        dataImportModel.labels = getBatchDataImportLabels();

        return JSON.serialize(dataImportModel);
    }

    @AuraEnabled
    public static List<DataImport__c> getDataImports(Id batchId){

        try {

            List<DataImport__c> dataImportRows = [SELECT Id
                    , Name
                    , Contact1_Firstname__c
                    , Contact1_Lastname__c
                    , Contact1Imported__c
                    , Contact1Imported__r.LastName
                    , Account1Imported__c
                    , Account1Imported__r.Name
                    , Donation_Date__c
                    , Donation_Amount__c
                    , Donation_Donor__c
                    , Payment_Method__c
                    , Payment_Check_Reference_Number__c
            FROM DataImport__c
            WHERE NPSP_Data_Import_Batch__c = :batchId
            ORDER BY Id ASC];

            return dataImportRows;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*******************************************************************************************************
    * @description Retrieves the object and field labels for the component.
    * @return Map of Batch Data Import object and field name keys to their labels.
    */
    @AuraEnabled
    public static Map<String, String> getBatchDataImportLabels() {

        Map<String, String> labels = new Map<String, String> {
                'accountLookup' => Schema.SObjectType.DataImport__c.fields.Account1Imported__c.getName(),
                'contactLookup' => Schema.SObjectType.DataImport__c.fields.Contact1Imported__c.getName(),
                'dataImportObject' => Schema.SObjectType.DataImport__c.getName()
        };

        return labels;
    }

    /*******************************************************************************************************
    * @description Retrieves the related list of columns.
    * @return list of Columns to use in Data Import grid
    */
    public static List<Column> getColumns() {
        List<Column> columns = new List<Column>();
        Set<String> fields = new Set<String>{'Donation_Amount__c',
                'Donation_Date__c',
                'Payment_Method__c',
                'Payment_Check_Reference_Number__c'
        };

        Map<String, Schema.DescribeFieldResult> fieldMap = UTIL_Describe.getAllFieldsDescribe(UTIL_Namespace.StrTokenNSPrefix('DataImport__c'));

        for (Schema.DescribeFieldResult dfr : fieldMap.values()) {
            String unnamespacedField = UTIL_Namespace.StrTokenRemoveNSPrefix(dfr.name);
            if (fields.contains(unnamespacedField)) {
                Column col = new Column();
                col.label = dfr.label;
                col.fieldName = dfr.name;
                col.editable = true;
                col.type = dfr.type.name().toLowerCase();

                columns.add(col);
            }
        }

        return columns;
    }

    /*******************************************************************************************************
    * @description a class to retrieve and save information related to Active and Available fields.
    */
    public class Column {
        @AuraEnabled public String label;
        @AuraEnabled public String fieldName;
        @AuraEnabled public Boolean editable;
        @AuraEnabled public String type;
    }

    /*******************************************************************************************************
    * @description a class to retrieve and save the required information for the Batch Data Import component.
    */
    public class DataImportModel {
        @AuraEnabled public Id id;
        @AuraEnabled public List<DataImport__c> dataImportRows;
        @AuraEnabled public List<Column> columns;
        @AuraEnabled public Map<String, String> labels;
    }

}