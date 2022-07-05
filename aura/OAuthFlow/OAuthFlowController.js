({
    doInit : function(component, event, helper) {
        //https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG95jctIhbyCpoMWwZyl6tgpkyrCVEbQw5Qyz2mjFenB10Q3Ig9oNrO8e_jds_MVLKczjLOAW.NlnKUOo9o&redirect_uri=https://login.salesforce.com/oauth2/callback&state=mystate
        //https://login.salesforce.com/services/oauth2/authorize?response_type=token 
        //response_type=code
        let frameUrl = component.get('v.iframeUrl')+'&client_id='+component.get('v.clientId')+'&redirect_uri='+component.get('v.redirectURL')+'&state='+component.get('v.state')+'&prompt=login&response_type=token';
        console.log('frameUrl::',frameUrl);
        component.set('v.iframeUrl', frameUrl);
        
        if(window.location.href.includes('access_token'))
        {
            console.log('access_token check');
            var mySubString = window.location.href.substring(
                window.location.href.indexOf("token=") + 6, 
                window.location.href.lastIndexOf("&instance_url")
            );
            console.log('mySubString::',mySubString);
            component.set('v.token', mySubString);
            $A.enqueueAction(component.get('c.verifyUser'));
        }
        
    },
    redirectToPage : function(component, event, helper) {
        window.location.href=component.get('v.iframeUrl');
    },
    
    saveSignature :function(component, event, helper){
        console.log('saveSignature');
        var childComponent = component.find("SignaturePad1");
        childComponent.set("v.recordId",component.get("v.CaseId"));
        childComponent.SaveSignature(component, event, helper);  
    },
    
    performLogout: function(component, event, helper) {
        try
        {
            console.log('access_token REVOKE LOGOUT ');     
            /*let myHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
            };
            
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                //redirect: 'follow'
            };
            let tokenStr = component.get('v.token');
            console.log('tokenStr::',tokenStr);
            //https://ctmsdemo-dev-ed.my.salesforce.com/services/auth/idp/oidc/logout
            //https://login.salesforce.com/services/oauth2/revoke 
            let getURL= 'https://login.salesforce.com/services/oauth2/revoke?token='+tokenStr;
            //let statUrl='https://login.salesforce.com/services/oauth2/userinfo?access_token=00D5w000006eozV%21ARsAQJg_mBFaE3vYptenXYU5BRiU2eVnCWuYNWRi4DsUicTEFQfujd4OjdktqUPLd5Sf8xYehhAVSQ_bhCXE8bosWpv7N5AD&format=json';
            console.log('getURL::',getURL);
            //console.log('statUrl::',statUrl);
            fetch(getURL, requestOptions)
            .then(response => response.json())
            .then(result => {console.log(result);console.log(result.name); component.set('v.username',result.name.toUpperCase());component.set('v.truthy',false);})
            .catch(error => {console.log('error', error); component.set('v.truthy',true);});*/
            
            var requestOptions = {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin':'https://ctmsdemo-dev-ed.lightning.force.com',
                    'Access-Control-Allow-Origin': '*' ,
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
                },
                //redirect: 'follow'
            };
            let tokenStr = component.get('v.token');
            console.log('tokenStr::',tokenStr);
            fetch("https://ctmsdemo-dev-ed.lightning.force.com/services/oauth2/revoke?token="+tokenStr, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => {
                //console.log('error', error);
                if (error instanceof TypeError) 
                {
                	console.log('TypeError error found');
                	component.set('v.truthy',false);
                }
                else {
                    console.log('someother error');
                }
            });
                               
            }
                catch(err){
                console.log('error::catch:::',err);
                component.set('v.truthy',true);
            }
    },
    
    verifyUser: function(component,event,helper){
        try
        {
            console.log('access_token check2 ');            
            var requestOptions = {
                method: 'GET',
                //headers: myHeaders,
                redirect: 'follow'
            };
            let tokenStr = component.get('v.token');
            console.log('tokenStr::',tokenStr);
            let getURL= 'https://login.salesforce.com/services/oauth2/userinfo?access_token='+tokenStr+'&format=json';
            let statUrl='https://login.salesforce.com/services/oauth2/userinfo?access_token=00D5w000006eozV%21ARsAQJg_mBFaE3vYptenXYU5BRiU2eVnCWuYNWRi4DsUicTEFQfujd4OjdktqUPLd5Sf8xYehhAVSQ_bhCXE8bosWpv7N5AD&format=json';
            console.log('getURL::',getURL);
            console.log('statUrl::',statUrl);
            fetch(getURL, requestOptions)
            .then(response => response.json())
            .then(result => {console.log(result);console.log(result.name); component.set('v.username',result.name.toUpperCase());component.set('v.truthy',true);})
            .catch(error => {
                             //console.log('error', error); 
                             //component.set('v.truthy',false);
                             if (error instanceof TypeError) 
                                 {
                                     console.log('TypeError error found');
                                     component.set('v.truthy',false);
                                 }
                             else 
                                {
                                    console.log('someother error');
                                }
            });
                               
            }
                catch(err){
                console.log('error::',err);
                component.set('v.truthy',false);
            }
    }
 })