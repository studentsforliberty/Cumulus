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

    clearRow: function (component, event, helper) {
        var eventFields = event.getParam("fields");
        console.log(eventFields);

        eventFields.forEach(function(field){
            evenfFields[field] = null;
        });

        event.setParam("fields", eventFields);
    },

    onSubmit: function (component, event, helper) {

        event.preventDefault(); // stop form submission
        helper.setBDIDonorInfo(component, event);
    },

    loadRowToTable: function (component, event, helper) {
        console.log('success!');
        helper.getDIs(component);
    },

    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get("v.value");

        console.log(donorType);
        if (donorType === 'Contact1') {
            helper.setDonorToContact(component);
        } else {
            helper.setDonorToAccount(component);
        }
    }
})