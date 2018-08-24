({
    doInit: function (component, event, helper) {
        //creating datatable columns
        //getting DataImport__c records from server by calling helper methods
        helper.getModel(component);
    },

    onSubmit: function (component, event, helper) {
        event.preventDefault(); // stop form submission
        helper.saveDataImportRecord(component, event);
    },

    onSuccess: function (component, event, helper) {
        helper.getDIs(component);
        helper.showToast(component, 'Success', "New gift has been added to the batch.");
        component.set("v.hasActiveRow",false);
        component.set("v.hasActiveRow",true);
    },

    clearRow: function (component, event, helper) {
        component.set("v.hasActiveRow",false);
        component.set("v.hasActiveRow",true);
    },

    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get("v.value");
        component.set("v.donorType", donorType);
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
    }
})