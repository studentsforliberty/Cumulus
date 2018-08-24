({
    clearRow: function (component, event, helper) {
        component.set("v.hasActiveRow",false);
        component.set("v.hasActiveRow",true);
    },

    doInit: function (component, event, helper) {
        helper.getModel(component);
    },

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
})