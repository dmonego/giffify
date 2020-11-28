/*!
 * Deep merge two or more objects together.
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Object}   objects  The objects to merge together
 * @returns {Object}            Merged values of defaults and options
 */
var deepMerge = function () {

	// Setup merged object
	var newObj = {};

	// Merge the object into the newObj object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					newObj[prop] = deepMerge(newObj[prop], obj[prop]);
				} else {
					newObj[prop] = obj[prop];
				}
			}
		}
    };
    
    // Loop through each object and conduct a merge
	for (var i = 0; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return newObj;
};


/*
Real simple bus. Shamelessly stolen fron the MDN EventTarget reference.
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
*/
class BusEvent extends Event  {
    constructor(eventName, state) {
        super(eventName);
        this.state = state;
    }
}

const Bus = function() {
    this.listeners = {};
    this.store = {}
};

Bus.prototype.listeners = null;
Bus.prototype.addEventListener = function(type, callback) {
    if (!(type in this.listeners)) {
        this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
};

Bus.prototype.removeEventListener = function(type, callback) {
    if (!(type in this.listeners)) {
        return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback){
            stack.splice(i, 1);
            return;
        }
    }
};

Bus.prototype.updateState = function(data) {
    this.store = deepMerge(this.store, data);
}

Bus.prototype.dispatchEvent = function(eventName, data) {
    this.updateState(data);
    const event = new BusEvent(eventName, this.store);
    if (!(event.type in this.listeners)) {
        return true;
    }
    var stack = this.listeners[event.type].slice();

    for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
    }
    return !event.defaultPrevented;
};
