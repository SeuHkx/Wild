/**
 * Created by Hekx on 16/2/22.
 */
var tabSwitch = function () {
    var hfiles = document.getElementById('hfiles');
    var createButton = document.getElementById('createButton');
    var selectButton = document.getElementById('filesLayout').querySelectorAll('.wd-button');
    var utils = {
        $hasClass: function (el, klass) {
            return !!el.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"));
        },
        $delClass: function (el, klass) {
            if (this.$hasClass(el, klass)) {
                el.className = el.className.replace(new RegExp("(\\s|^)" + klass + "(\\s|$)"), "");
            }
        }
    };
    for (var i = 0; i < selectButton.length; i += 1) {
        if (utils.$hasClass(selectButton[i], 'active')) {
            selectButton[i].setAttribute('data-state', 'active');
        } else {
            selectButton[i].setAttribute('data-state', 'normal');
        }
        selectButton[i].onclick = (function (index) {
            return function () {
                for (var j = 0; j < selectButton.length; j += 1) {
                    if (index === j) {
                        if (selectButton[index].getAttribute('data-state') === 'normal') {
                            selectButton[index].setAttribute('data-state', 'active');
                            selectButton[index].className += ' ' + 'active';
                            if (selectButton[index].getAttribute('data-style') === 'cube') {
                                utils.$delClass(hfiles, 'hfiler-list');
                                hfiles.className += ' ' + 'hfiler-cube';
                            }
                        }
                        continue;
                    } else {
                        selectButton[j].setAttribute('data-state', 'normal');
                        utils.$delClass(selectButton[j], 'active');
                        if (selectButton[index].getAttribute('data-style') === 'list') {
                            utils.$delClass(hfiles, 'hfiler-cube');
                            hfiles.className += ' ' + 'hfiler-list';
                        }
                    }
                }
            }
        }(i))
    }
};
window.tabSwitch = tabSwitch;