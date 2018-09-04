({
    /**
     * @description: clears the active entry form
     */
    cancelForm: function (component, event, helper) {
        helper.clearRow(component);
    },

    /**
     * @description: instantiates component. Only called when component is first loaded.
     */
    doInit: function (component, event, helper) {
        helper.getModel(component);
    },

    /**
     * @description: handles selected row action in the datatable. Current option list: delete.
     */
    handleRowAction: function (component, event, helper) {
        helper.showSpinner(component);
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
                    helper.hideSpinner(component);
                });
                $A.enqueueAction(action);
                break;
        }
    },


    /**
     * @description: callback function for lightning:recordEditForm. Queries DataImport__c records,
     * shows toast, and clears recordEditForm.
     */
    onTableSave: function (component, event, helper) {
        var values = event.getParam("draftValues");
        // validation would happen here
        helper.handleTableSave(component, values);
        component.find("dataImportRowsDataTable").set("v.draftValues", null);
    },

    /**
     * @description: callback function for lightning:recordEditForm. Queries DataImport__c records,
     * shows toast, and clears recordEditForm.
     */
    onSuccess: function (component, event, helper) {
        helper.getDIs(component);
        helper.showToast(component, 'Success', "New gift has been added to the batch.");
        helper.clearRow(component);
    },

    /**
     * @description: sets the donor type. Used to circumvent the unhelpful labeling of Account1/Contact1.
     */
    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get("v.value");
        component.set("v.donorType", donorType);
    },
})