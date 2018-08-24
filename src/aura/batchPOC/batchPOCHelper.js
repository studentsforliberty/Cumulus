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

    setDataTableRows: function(component, responseRows) {
        var rows = [];
        responseRows.forEach(function (currentRow) {
            if (currentRow.Donation_Donor__c === 'Account1') {
                currentRow.Donor = currentRow.Account1Imported__c;
            } else {
                currentRow.Donor = currentRow.Contact1Imported__c;
            }
            rows.push(currentRow);
        });
        component.set("v.data", rows);
    },

    setColumns: function(component, dataColumns) {
        var columns = [];
        columns.push({label: 'Donor', fieldName: 'Donor', type: 'text', editable: false});

        dataColumns.forEach(function(col){
            columns.push({label: col.label, fieldName: col.fieldName, type: col.type, editable: col.editable});
        });

        columns.push({label: 'Action', type: 'button', initialWidth: 135, typeAttributes:
            {label: 'Delete', name: 'view_details', title: 'Click to View or Edit Details'}
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

        component.find('recordEditForm').submit(eventFields);

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