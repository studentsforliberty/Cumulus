({
    doInit : function(component, event, helper) {
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
            {label: 'Action', type: 'button', initialWidth: 135, typeAttributes:
                    { label: 'Delete', name: 'view_details', title: 'Click to View or Edit Details'}}
        ]);
        //getting DataImport__c records from server by calling helper methods
        helper.getDIs(component, helper);

    },

    updateTable: function (component, event, helper) {

        var rows = component.get("v.data");
        var myDI = component.get("v.rowId");
        console.log(myDI);
        for (var i = 0; i<rows.length; i++) {
            console.log(rows[i]);
            if (rows[i].id === myDI.Id) {
                rows[i].FirstName = myDI.Contact1_Firstname__c;
            }
        }

    },

    //this function will be called when view button is pressed in datatable
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var di = event.getParam('row');
        switch (action.name) {
            case 'view_details':
                component.set("v.rowId", di.Id);
                break;
            default:
                component.set("v.rowId", di.Id);
                break;
        }
        if(component.get("v.rowId")){
            component.set("v.showDetails", true);
        }
    },

    saveRow: function(component, event, helper) {
        console.log(component.find('Donation_Donor__c'));
    },

    setDonorType: function(component, event, helper) {
        var donorType = event.getSource().get("v.value");
        console.log(donorType);
        component.set("v.donorType", donorType);
    }
})