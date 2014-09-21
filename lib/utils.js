exports.extend = function (target, source) {
    var slice = Array.prototype.slice,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    slice.call(arguments, 1).forEach(function (o) {
        for(var key in o) {
            hasOwnProperty.call(o, key) && (target[key] = o[key]);
        }
    });

    return target;
};
