({
    clearRow: function (component, event, helper) {
        component.set("v.hasActiveRow",false);
        component.set("v.hasActiveRow",true);
    },

    doInit: function (component, event, helper) {
        //creating datatable columns
        //getting DataImport__c records from server by calling helper methods
        helper.getModel(component);
    },

    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'delete':
                var action = component.get("c.deleteDataImportRow");
                action.setParams({batchId: component.get("v.recordId"), dataImportId: row.Id});
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var response = JSON.parse(response.getReturnValue());
                        helper.setDataTableRows(component, response);
                        helper.showToast(component, 'Success', 'Gift successfully deleted.');
                    } else {
                        helper.showToast(component, 'Error', response.getReturnValue());
                    }
                });
                $A.enqueueAction(action);

                console.log(JSON.stringify(row));
                /*var rows = cmp.get('v.data');
                var rowIndex = rows.indexOf(row);
                rows.splice(rowIndex, 1);
                cmp.set('v.data', rows);*/
                break;
        }
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