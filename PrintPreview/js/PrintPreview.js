/************************************************ 
Print Manager
Copyright (c) 2015 Dongxu Ren  http://www.rendxx.com/

License: MIT (http://www.opensource.org/licenses/mit-license.php)
Version: 1.0
Update: 2015-08-26

Description:
   Print given dom (html string + css json)
   Will call browser print function to do the job
   
Compatibility:
    Chrome; Fire Fox; Safari; Edge; IE 9-11; IE 7,8;

API:
    $$.print.preview(container, htmlStr, cssJson)
        * Render a preview of print content in given dom element

        - container: [dom element]
            the dom element to contain the preview iframe
        - htmlStr: [string]
            print content html string
        - cssJson: [json]
            css to apply to the html for printing.
            format: {[selecter]:{[css key]:[css value],[css key]:[css value], ...}, ...}

            
    $$.print.exec(name, htmlStr, cssJson)
        * Print given content

        -title: [string]
            title of the print page
        - htmlStr: [string]
            print content html string
        - cssJson: [json]
            css to apply to the html for printing.
            format: {[selecter]:{[css key]:[css value],[css key]:[css value], ...}, ...}
            
    $$.print.exec(name)
        * Print preview content. Only work after preview and before clearing cache
        
        -title: [string]
            title of the print page

    $$.print.clear()
        * Clear cache, including preview dom and reference to it


************************************************/
(function () {
    "use strict";

    // build style element
    var _buildStyle = function (cssJson, doc) {
        doc = doc || document;
        var style = doc.createElement('style');
        var styleStr = "";
        style.type = 'text/css';

        for (var itemName in cssJson) {
            if (!cssJson.hasOwnProperty(itemName)) continue;
            var cssItemStr = itemName + '{';
            var cssItem = cssJson[itemName];
            for (var i in cssItem) {
                if (!cssItem.hasOwnProperty(i)) continue;
                cssItemStr += i + ':' + cssItem[i] + ';';
            }
            cssItemStr += '}';
            styleStr += cssItemStr;
        }
        if (style.styleSheet) style.styleSheet.cssText = styleStr;  // ie 7-8
        else style.innerHTML = styleStr;                            // Others
        return style;
    };

    // create an iframe
    var _createIframe = function () {
        var ifrm = document.createElement("iframe");
        ifrm.width = "100%";
        ifrm.height = "100%";
        ifrm.frameborder = "0";
        ifrm.border = "0";
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";
        ifrm.style.position = "absolute";
        ifrm.style.top = "0";
        ifrm.style.left = "0";
        ifrm.style.margin = "0";
        ifrm.style.padding = "0";
        ifrm.style.border = "0";
        ifrm.style.overflow = "auto";
        ifrm.style.zIndex = "100";
        return ifrm;
    };

    // create print wrap
    var _createPrintWrap = function () {
        var iDiv = document.createElement('div');
        iDiv.style.width = "0";
        iDiv.style.height = "0";
        iDiv.style.position = "absolute";
        iDiv.style.bottom = "0";
        iDiv.style.right = "0";
        iDiv.style.overflow = "hidden";
        return iDiv;
    };

    var _initPrint = function () {
        var _printFrame;
        var _printDoc;
        var _loaded = false;
        // show preview in given container
        this.preview = function (container, opts, callback) {
            try {
                var htmlStr = opts.html;
                var cssJson = opts.css;
                var domain = opts.domain;

                // create iframe
                _printFrame = null;
                _loaded = false;
                var ifrm = _createIframe();
                _printFrame = ifrm;
                var onload = function () {
                    //console.log('1');
                    if (_loaded) return;
                    if (callback) callback();
                    _loaded = true;
                };

                if (ifrm.attachEvent) ifrm.attachEvent('onload', onload);
                else ifrm.addEventListener('load', onload, false)

                container.appendChild(ifrm);
                if (domain != null) ifrm.src = _html["iframeSrcWithDomain"].replace('#domain#', domain);
                var doc = ifrm.contentWindow.document;
                _printDoc = doc;
                doc.open();
                doc.write(htmlStr);
                // css
                doc.getElementsByTagName('head')[0].appendChild(_buildStyle(_css, doc));
                if (cssJson !== null && cssJson !== undefined) {
                    doc.getElementsByTagName('head')[0].appendChild(_buildStyle(cssJson, doc));
                }
                doc.close();
            } catch (e) {
                throw new Error(e);
            }
        };

        // print
        this.exec = function (opts, callback) {
            var title = opts.title;
            var htmlStr = opts.html;
            var cssJson = opts.css;
            var domain = opts.domain;

            var printIframe = function () {
                if (title !== null && title !== undefined) _printDoc.title = title;
                if (!_printDoc.execCommand('print', false, null))
                    _printFrame.contentWindow.print();
                if (callback) callback();
            };

            try {
                var _printWrap;
                if (htmlStr !== null && htmlStr !== undefined) {
                    _printWrap = _createPrintWrap();
                    document.body.appendChild(_printWrap);
                    this.preview(_printWrap, opts, function () {
                        printIframe();
                        document.body.removeChild(_printWrap);
                    });
                } else {
                    if (_printDoc) {
                        if (_loaded) printIframe();
                    }
                }
            } catch (e) {
                throw new Error(e);
            }
        };

        // clear preview panel and reference
        this.clear = function () {
            if (_printFrame) _printFrame.parentNode.removeChild(_printFrame);
            _printFrame = null;
            _loaded = false;
        };
    };

    var _html = {
        'iframeSrcWithDomain': "javascript:document.write('<script>document.domain=\"#domain#\";</script>')",
        'printWrap': '<div style="width:0px;height:0px;position:absolute;top:0;right:0;overflow:hidden;margin:0;padding:0;border:0;"></div>',
        'style': '<style type="text/css">#content#</style>'
    };

    var _css = {
        'body': {
            'margin': '0px',
            'border': '0px',
            'padding': '0px'
        }
    };

    window.$$ = window.$$ || {};
    window.$$.print = new _initPrint();
})();
//# sourceMappingURL=PrintPreview.js.map
