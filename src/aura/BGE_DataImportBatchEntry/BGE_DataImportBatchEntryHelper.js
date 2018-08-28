({
    /**
     * @description: clear the active entry form by forcing the recordEditForm to rerender with an aura:if
     */
    clearRow: function (component) {
        component.set("v.hasActiveRow", false);
        component.set("v.hasActiveRow", true);
    },

    /**
     * @description: retrieves the dataImportRows and sets them to the table.
     */
    getDIs: function (component) {
        var action = component.get("c.getDataImports");
        action.setParams({batchId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.setDataTableRows(component, response.getReturnValue());
            } else {
                this.showToast(component, 'Error', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },

    /**
     * @description: retrieves the model information. If successful, sets the model; otherwise alerts user.
     */
    getModel: function(component) {
        this.showSpinner(component);
        var action = component.get("c.getDataImportModel");
        action.setParams({batchId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = JSON.parse(response.getReturnValue());
                this.setModel(component, response);
            } else {
                this.showToast(component, 'Error', response.getReturnValue());
            }
            this.hideSpinner(component);
        });
        $A.enqueueAction(action);
    },

    /**
     * @description: flattens the DataImportRow class data to include donor information at the same level as the rest of the DataImport__c record.
     * @param responseRows: custom DataImportRow class data passed from the Apex controller.
     */
    setDataTableRows: function(component, responseRows) {
        var rows = [];
        responseRows.forEach(function (currentRow) {
            var row = currentRow.record;
            row.donor = currentRow.donor;
            rows.push(row);
        });
        component.set("v.data", rows);
    },

    /**
     * @description: sets column with a derived Donor field, any columns passed from Apex, and available actions.
     * @param dataColumns: custom Column class data passed from the Apex controller.
     */
    setColumns: function(component, dataColumns) {
        var columns = [];
        columns.push({label: 'Donor', fieldName: 'donor', type: 'text', editable: false});

        dataColumns.forEach(function(col){
            columns.push({label: col.label, fieldName: col.fieldName, type: col.type, editable: col.editable});
        });

        columns.push({type: 'action', typeAttributes: { rowActions: [{label: 'Delete', name: 'delete', title: 'Delete'}] }
        });

        component.set('v.columns', columns);
    },

    /**
     * @description: sets data import fields to use dynamically in the recordEditForm.
     * @param dataColumns: custom Column class data passed from the Apex controller.
     */
    setDataImportFields: function (component, dataColumns) {
        var dataImportFields = [];

        dataColumns.forEach(function(field){
            dataImportFields.push({label: field.label, name: field.fieldName});
        });

        component.set('v.dataImportFields', dataImportFields);
    },

    /**
     * @description: sets data import fields to use dynamically in the recordEditForm.
     * @param dataColumns: custom Column class data passed from the Apex controller.
     */
    setModel: function (component, model) {
        component.set("v.labels", model.labels);
        this.setDataTableRows(component, model.dataImportRows);
        this.setColumns(component, model.columns);
        this.setDataImportFields(component, model.columns);
        component.set("v.hasActiveRow", true);
    },

    /**
     * @description: displays standard toast to user based on success or failure of their action
     * @param type: used for Title and Type on toast, depending on case
     * @param message: body of message to display
     */
    showToast: function(component, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": type,
            "message": message,
            "type": type.toLowerCase()
        });
        toastEvent.fire();
    },

    /**
     * @description: shows lightning:dataTable spinner
     */
    showSpinner: function (component) {
        var spinner = component.find("dataTableSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },

    /**
     * @description: hides lightning:dataTable spinner
     */
    hideSpinner: function (component) {
        var spinner = component.find("dataTableSpinner");
        $A.util.addClass(spinner, "slds-hide");
    }

})