﻿limejs = limejs || {};
limejs.loader = {
    "systemLibPath" : "system/",

    "scripts": [],
    "styles": [],
    "libs": [],

    "loadConfig": function (file, require, callback) {
        var data;
        
        $.getJSON(file, function (json) {
            data = json;
            
        })
        //feel free to use chained handlers, or even make custom events out of them!
        .success(function () {
            limejs.log.info("Config loaded: " + file.toString());
           
        })
        .error(function (jqxhr, textStatus, error) {
            if (require == true) {
                limejs.log.error(error)
                limejs.log.error("Config failed to load: " + file.toString());
            } else {
                limejs.log.info("Config not loaded: " + file.toString());
            }
        })
        .complete(function () {
            //limejs.log.debug("Content of config file " + file + ": " + JSON.stringify(data));
            callback(data);
        });
    },
    "pushResources": function (data, appPath) {
        var path;

        if (typeof data == 'undefined') {
            return;
        }
        console.log(path + data.libs);
        $.each(data.scripts, function (i) {
            path = appPath == '/' ? limejs.loader.systemLibPath+'js/' : appPath;
            limejs.loader.scripts.push(path + data.scripts[i]);
        })

        $.each(data.libs, function (i) {
            path = limejs.loader.systemLibPath+'js/';
            limejs.loader.libs.push(path + data.libs[i]);
        })

        $.each(data.styles, function (i) {
            path = appPath == '/' ? limejs.loader.systemLibPath + 'css/' : appPath;
            limejs.loader.styles.push(path + data.styles[i]);
        })
    },


    "loadResources": function () {
        
        limejs.loader.scripts = limejs.loader.scripts.filter(this.uniqueFilter)
        limejs.loader.styles = limejs.loader.styles.filter(this.uniqueFilter)
        limejs.loader.libs = limejs.loader.libs.filter(this.uniqueFilter)
       // limejs.log.debug(limejs.loader.libs);
        limejs.log.debug("Scripts to load:" + limejs.loader.scripts);
        limejs.log.debug("Styles to load: " + limejs.loader.styles);
        limejs.log.debug("Libs to load: " + limejs.loader.libs);

        $.each(limejs.loader.scripts, function (i) {
            $.getScript(limejs.loader.scripts[i]);
        })

        $.each(limejs.loader.styles, function (i) {
            $('<link/>', { rel: 'stylesheet', type: 'text/css', href: limejs.loader.styles[i] }).appendTo('head');
        })

        $.each(limejs.loader.libs, function (i) {
            $.getScript(limejs.loader.libs[i]);
        })

    },

    "loadView": function (file, element) {
        try {
             file = file+".html";
             element.load(file, function (response, status, xhr) {
                if (status == "error") {
                    limejs.log.error('View "' + file + '" could not be loaded')
                } else {
                    limejs.log.info('View "' + file + '" loaded successfully');
                }
            })
        } catch (e) {
            limejs.log.error("Resource could not be found. If using Chrome, make sure --file-access-from-file is enabled", e);
        }

    },

    "loadData": function () {
        try {
            var record = limejs.limeDataConnection.ActiveInspector.Record
            //limejs.actionPadData = limejs.loader.recordToJSON(record);
            limejs.vm[limejs.activeClass] = limejs.loader.controlsToJSON(limejs.limeDataConnection.ActiveControls);
            limejs.log.info('Data from ActiveInspector.record loaded successfully');
        } catch (e) {
            limejs.log.warn("ActiveInspector could not be loaded. Make sure you are running in LIME");
        }
    },

    "loadSiteConfig": function () {
        
        this.loadConfig(limejs.loader.systemLibPath + 'config/config.json', true, function (config) {
            limejs.loader.pushResources(config, '/');
        });
    },

    "uniqueFilter": function (e, i, arr) {
        return arr.lastIndexOf(e) === i;
    },

    "recordToJSON": function (record) {
        var nbrOfFields = record.Fields.Count;
        var className = record.Class.Name 
        var attr;
        var json = {};
        json[className] = {};
        
        for (var i = 1; i <= nbrOfFields; i++) {
            attr = record.Fields(i).Name;
                json[className][attr] = {};
                json[className][attr]["text"] = record.Text(i);
                json[className][attr]['value'] = record.Value(i);
                if (record.Fields(i).Type == 16) { //Relation
                    json[className][attr]['class'] = record.Fields(i).LinkedField.Class.Name;
                }
                if (record.Fields(i).Type == (19 || 18 ) ) { //Option or Set
                    json[className][attr]['key'] = record.GetOptionKey(i);
                }

        }
        return json;

    },

    "controlsToJSON": function (controls) {
        var nbrOfControls = controls.Count;
        var className = controls.Class.Name
        var attr;
        var json = {};
        json[className] = {};
        
        for (var i = 1; i <= nbrOfControls; i++) {
            attr = controls(i).Field.Name;
            json[className][attr] = {};
            json[className][attr]["text"] = controls(i).Text;
            json[className][attr]['value'] =controls(i).Value;
            if (controls(i).Field.Type == 16) { //Relation
                json[className][attr]['class'] = controls(i).Field.LinkedField.Class.Name;
            }
            if (controls(i).Field.Type == (19 || 18)) { //Option or Set
                json[className][attr]['key'] = controls(i).OptionKey;
            }

        }
        return json;

    },

    setFallBackDummyData: function (node) {
        //set text
        var reg = new RegExp("text\:[^\,\}]*");
        $('[data-bind]').each(function () {
            var match = reg.exec($(this).attr('data-bind'))
            var value = '';
            if (match) {
                value = 'Text: ' + match[0].split(":")[1].trim();
                $(this).html(value);
            }
        });

        //set value
        var reg = new RegExp("value\:[^\,\}]*");
        $('[data-bind]').each(function () {
            var match = reg.exec($(this).attr('data-bind'))
            var value = '';
            if (match) {
                value = 'Value: ' + match[0].split(":")[1].trim();
                $(this).attr('value', value);
            }
        });

        //set value
        var reg = new RegExp("loc\:[^\,\}]*");
        $('[data-bind]').each(function () {
            var match = reg.exec($(this).attr('data-bind'))
            var value = '';
            if (match) {
                value = 'LOC: ' + match[0].split(":")[1].trim();
                $(this).html(value);
            }
        });
    },

}