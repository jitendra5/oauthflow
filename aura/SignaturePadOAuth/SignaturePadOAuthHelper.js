({
    handleInit : function(component, event) {
        //
        var canvas = component.find('signature-pad').getElement();
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        var signaturePad = new SignaturePad(canvas, {
            minWidth: .25,
            maxWidth: 2
        });
        component.set("v.signaturePad", signaturePad);
    },
    handleSaveSignature : function(component, event,helper,data) {
        var sig = component.get("v.signaturePad");
        console.log('sig::',sig);
        if(!sig._isEmpty){
            var action = component.get("c.uploadSignature");
             action.setParams({
                "caseId": data,
                "b64SignData": sig.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    this.clearCanvas(component, event);
                    var errorReturned = response.getReturnValue();
                    
                    if(errorReturned == ''){
                        this.showToast(component,true, '');
                        console.log("Signature Attached");
                    } else {
                        console.log(errorReturned); // Technical error for maintenance
                        
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },
    clearCanvas : function(component, event) {
        var sig = component.get("v.signaturePad");
        sig.clear();
    },
    checkCanvasStatus : function(component, event) {
       
        var data=component.get("v.signaturePad"); 
       
        return data._isEmpty;
    },
    
    //Toast Message to show 
    showToast: function(component,isSuccess, error){
        var toastEvent = $A.get("e.force:showToast");
        var type = isSuccess ? "success" : "error";
        var title = isSuccess ? 'Success' : 'Failed';
        var message = isSuccess ? 'Sucess' : error;
        toastEvent.setParams({
            "type": type,
            "title": title,
            "message": message,
            "mode": "pester"
        });
        toastEvent.fire();
    }
    
})