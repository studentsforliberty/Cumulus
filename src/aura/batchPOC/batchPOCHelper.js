({
//this function will fetch Car__c records from server
    getDIs : function(component, helper) {
        var action = component.get("c.getDataImports");
        action.setParams({ batchId : component.get("v.recordId") });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rows = [];
                response.getReturnValue().forEach(function(currentRow){
                    if(currentRow.Donation_Donor__c === 'Account1') {
                        currentRow.Donor = currentRow.Account1Imported__c;
                    } else {
                        currentRow.Donor = currentRow.Contact1Imported__c;
                    }
                    rows.push(currentRow);
                });
                component.set("v.data", rows);
            }
        });
        $A.enqueueAction(action);
    },
})