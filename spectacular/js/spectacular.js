(function ($, w) {
    var spectacular = {
        model:null,
        origHTML: null,
        origModel:null,
        init:function(){
            var self = this;
            $(document).ready(function () {
                //get main model
                self.model = eval($('[data-model]').first().attr('data-model'));
                self.origHTML = $('body')[0].innerHTML;
                //extend model with watcher
                self.model.watch = function () {
                    w = setInterval(function () {
                        if (!objectEquals(self.model,self.origModel)) {
                            self.parseDocument();
                            self.syncModels();
                        }
                    }, 1000);
                }
                self.syncModels();
                self.parseDocument();
                self.model.watch();

                //attach event handlers on inputs
                //trace binding first
                $(':text').each(function () {
                    //var m = eval( $(this).attr('data-model'));
                    //$(this).prop('true-model', m);
                })
                $(':text').bind('keyup', function (k) {
                    //$(this).prop('true-model', 'sven');
                });

            });
        },
        syncModels:function(){
            this.origModel = {};
            jQuery.extend(this.origModel, this.model);
        },
        parseDocument:function() {
            //NOTE must save shadow copy to work with = original
            var content = this.origHTML;
            var fMatch = false;
            //move next... start from after }}
            var ind1 = content.indexOf("{{");
            var result = "";
            var lastOccurance = 0;
            while (ind1 !== -1) {
                var ind2 = content.indexOf("}}");
                var propSelector = (content.substring(ind1 + 2, ind2));
                result += content.substring(0, ind1) + this.model[propSelector];
                content = content.substring(ind2 + 2);
                ind1 = content.indexOf("{{");
            }
            //append remaining
            result += content;
            $('body').html(result);
        }
    }
    spectacular.init();
    return spectacular;
    //borrowed..... Make my own later, this is osnygg
    function countProps(obj) {
        var count = 0;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                count++;
            }
        }
        return count;
    };

    function objectEquals(v1, v2) {

        if (typeof (v1) !== typeof (v2)) {
            return false;
        }

        if (typeof (v1) === "function") {
            return v1.toString() === v2.toString();
        }

        if (v1 instanceof Object && v2 instanceof Object) {
            if (countProps(v1) !== countProps(v2)) {
                return false;
            }
            var r = true;
            for (k in v1) {
                r = objectEquals(v1[k], v2[k]);
                if (!r) {
                    return false;
                }
            }
            return true;
        } else {
            return v1 === v2;
        }
    }


})(jQuery, window);