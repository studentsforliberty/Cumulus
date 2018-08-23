({
//this function will fetch Car__c records from server
  getDIs: function (component) {
    var action = component.get("c.getDataImports");
    action.setParams({batchId: component.get("v.recordId")});
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var rows = [];
        response.getReturnValue().forEach(function (currentRow) {
          if (currentRow.Donation_Donor__c === 'Account1') {
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
  }
})