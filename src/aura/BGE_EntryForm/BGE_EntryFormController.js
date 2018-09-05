({
    callFocus: function(component){
        component.find("donorType").focus();
    },

    /**
     * @description: alerts parent component that form needs to be cleared
     */
    cancelForm: function (component, event, helper) {
        var sendMessage = $A.get('e.ltng:sendMessage');
        sendMessage.setParams({
            'channel': 'onCancel',
            'message': ''
        });
        sendMessage.fire();
        component.destroy();
    },

    /**
     * @description: alerts parent component that record is saved
     */
    onSuccess: function (component, event, helper) {
        //throw event here
        var sendMessage = $A.get('e.ltng:sendMessage');
        sendMessage.setParams({
            'channel': 'onSuccess',
            'message': ''
        });
        sendMessage.fire();
        component.destroy();
    },

    /**
     * @description: sets the donor type. Used to circumvent the unhelpful labeling of Account1/Contact1.
     */
    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get("v.value");
        component.set("v.donorType", donorType);
        var sendMessage = $A.get('e.ltng:sendMessage');
        sendMessage.setParams({
            'channel': 'setDonorType',
            'message': donorType
        });
        sendMessage.fire();
    },
})