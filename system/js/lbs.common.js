﻿lbs.common = {

    /**
    Fetch a random funny error text
    */
    "getErrorText": function () {
        var nbr = Math.floor((Math.random() * 5) + 1);
        switch (nbr) {
            case 1:
                return "Oh snap!"
                break;
            case 2:
                return "Oh no!"
                break;
            case 3:
                return "God damit!"
                break;
            case 4:
                return "Holy guacamole!"
                break;
            case 5:
                return "Arghhhh!"
                break;
        }
    },

    /**
    URLencode sensitive strings
    */
    "escapeHtml": function (unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    },

    /**
    Create a limelink from class, id, server and database properties
    */
    "createLimeLink": function (limeClass, limeId) {
        return "limecrm:"+limeClass+"."+lbs.activeDatabase + "." + lbs.activeServer + "?" + limeId
    },

    /**
    Fetch the url parameters from the GET-URL
    */
    "getURLParameter": function (name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    },

    /**
    * Helperfunction to run VBA functions from JS
    */
    "executeVba": function (inString) {
        try {
            lbs.log.debug("Trying to execute VBA:" + inString);

            var inArgs = inString.split(',');

            if (inArgs.length > 1) {

                var args = "";
                var vbaline = "lbs.limeDataConnection.Run('" + inArgs[0] + "', ";
                for (var i = 1; i < inArgs.length; i++) {
                    while (inArgs[i].charAt(0) === ' ') {
                        inArgs[i] = inArgs[i].substr(1);
                    }
                    args += "'" + inArgs[i] + "'";
                    if (i != inArgs.length - 1)
                        args += ",";
                }
                vbaline += args + ")";
                //alert(vbaline)
                eval(vbaline);
            }
            else {
                return lbs.limeDataConnection.Run(arguments[0]);
            }

        } catch (e) {
            return null;
            lbs.log.error("executeVBA:" + vbaline, e);

        }
    },

    /**
    replace newline with br
    */
    nl2br: function (input) {
        return input.replace(/\n/g, '<br />');
    },

 
    /**
    Add newline if braket
    */
    brak2br: function (input) {
        return input.replace(/{/g, '<br />').replace(/}/g, '<br />');
    },

    /**
    Add attributes from one JS objekt to another. Duplicates are discarded.
    */
    mergeOptions: function (obj1, obj2) {
        $.each(obj2, function (key, value) {
            if (!obj1[key]) {
                obj1[key] = value;
            } else {
                lbs.log.warn("Key " + key + ' was not added to the view model. Key already exists');
            }
        })
        return obj1;
   },
    
}