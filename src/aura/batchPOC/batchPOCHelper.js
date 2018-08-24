({
    clearRow: function (component, event) {
        //component.set(.recordId, null);
    },

    getDIs: function (component) {
        var action = component.get("c.getDataImports");
        action.setParams({batchId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.setDataTableRows(component, response.getReturnValue());
            } else {
                console.log('error: ' + response);
                this.showToast(component, 'Error', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },

    getModel: function(component) {
        var action = component.get("c.getDataImportModel");
        action.setParams({batchId: component.get("v.recordId")});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = JSON.parse(response.getReturnValue());
                component.set("v.labels", response.labels);
                this.setDataTableRows(component, response.dataImportRows);
                this.setColumns(component, response.columns);
                this.setFormFields(component, response.columns);
                component.set("v.hasActiveRow", true);
            } else {
                this.showToast(component, 'Error', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },

    setDataTableRows: function(component, responseRows) {
        var rows = [];
        responseRows.forEach(function (currentRow) {
            var row = currentRow.record;
            row.donor = currentRow.donor;
            rows.push(row);
        });
        component.set("v.data", rows);
    },

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

    setFormFields: function (component, dataColumns) {
        var formFields = [];

        dataColumns.forEach(function(field){
            formFields.push({label: field.label, name: field.fieldName});
        });

        component.set('v.formFields', formFields);
    },

    showToast: function(component, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": type,
            "message": message,
            "type": type.toLowerCase()
        });
        toastEvent.fire();
    }
})