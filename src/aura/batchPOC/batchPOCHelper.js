({
//this function will fetch Car__c records from server
    getDIs: function (component) {
        var action = component.get("c.getDataImports");
        action.setParams({batchId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rows = [];
                response.getReturnValue().forEach(function (currentRow) {
                    if (currentRow.Donation_Donor__c === 'Account1') {
                        currentRow.Donor = currentRow.Account1Imported__c;
                    } else {
                        currentRow.Donor = currentRow.Contact1Imported__c;
                    }
                    rows.push(currentRow);
                });
                component.set("v.data", rows);
            }
        });
        $A.enqueueAction(action);
    },

    clearRow: function (component, event) {
        //component.set(.recordId, null);
    },

    setDonorToContact: function (component) {
        var contactDiv = component.find("contactDiv");
        $A.util.removeClass(contactDiv, 'slds-hide');

        var accountDiv = component.find("accountDiv");
        $A.util.addClass(accountDiv, 'slds-hide');
    },
    setDonorToAccount: function (component) {
        var contactDiv = component.find("contactDiv");
        $A.util.addClass(contactDiv, 'slds-hide');

        var accountDiv = component.find("accountDiv");
        $A.util.removeClass(accountDiv, 'slds-hide');
    },

    saveDataImportRecord: function (component, event) {
        var donorType = component.find('donorType').get('v.value');
        console.log(donorType);

        //  get all fields from the form
        var eventFields = event.getParam("fields");

        // set donor type to BDI readable format
        eventFields.Donation_Donor__c = donorType;

        // if value is present in inactive donor field, remove it
        if (donorType === 'Account1') {
            eventFields.Contact1Imported__c = '';
        } else if (donorType === 'Contact1') {
            eventFields.AccountImported__c = '';
        }

        eventFields['NPSP_Data_Import_Batch__c'] = component.get("v.recordId");

        component.find('recordViewForm').submit(eventFields);

    }
})