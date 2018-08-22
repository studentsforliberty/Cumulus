({
//this function will fetch Car__c records from server
    getDIs : function(component, helper) {
        var action = component.get("c.getDataImports");
        action.setParams({ batchId : component.get("v.recordId") });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.data", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
})