({
    doInit: function (component, event, helper) {
        //creating datatable columns
        component.set('v.columns', [
            {label: 'Donor', fieldName: 'Donor', type: 'text', editable: false},
            //{label: 'Contact', fieldName: 'Contact1Imported__c', type: 'text', editable: false},
            //{label: 'Account', fieldName: 'Account1Imported__c', type: 'text', editable: false},
            {label: 'Amount', fieldName: 'Donation_Amount__c', type: 'currency', editable: true},
            {label: 'Donation Date', fieldName: 'Donation_Date__c', type: 'date', editable: true},
            {label: 'Payment Method', fieldName: 'Payment_Method__c', type: 'text', editable: true},
            {label: 'Check Number', fieldName: 'Payment_Check_Reference_Number__c', type: 'text', editable: true}
            ,
            {
                label: 'Action', type: 'button', initialWidth: 135, typeAttributes:
                    {label: 'Delete', name: 'view_details', title: 'Click to View or Edit Details'}
            }
        ]);
        //getting DataImport__c records from server by calling helper methods
        helper.getDIs(component);
        helper.setDonorToContact(component);
    },

    updateTable: function (component, event, helper) {

        var rows = component.get("v.data");
        var myDI = component.get("v.rowId");
        console.log(myDI);
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i]);
            if (rows[i].id === myDI.Id) {
                rows[i].FirstName = myDI.Contact1_Firstname__c;
            }
        }
    },

    onSubmit: function (component, event, helper) {
        event.preventDefault(); // stop form submission
        helper.saveDataImportRecord(component, event);
    },

    onSuccess: function (component, event, helper) {
        helper.getDIs(component);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({"title": "Success!","message": "The property's info has been updated.","type": "success"});
        toastEvent.fire();
        component.set("v.hasActiveRow",false);
        component.set("v.hasActiveRow",true);
        helper.setDonorToContact(component);
        //helper.clearRow(component, event);

    },

    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get("v.value");

        if (donorType === 'Contact1') {
            helper.setDonorToContact(component);
        } else {
            helper.setDonorToAccount(component);
        }
    }
})