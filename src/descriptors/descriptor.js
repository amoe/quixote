// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var oop = require("../util/oop.js");
var Value = require("../values/value.js");

var Me = module.exports = function Descriptor() {};
Me.extend = oop.extendFn(Me);
oop.makeAbstract(Me, [
	"value",
	"convert",
	"toString"
]);

Me.prototype.diff = function diff(expected) {
	var expectedType = typeof expected;
	if (expected === null) expectedType = "null";

	if (expectedType === "undefined") {
		throw new Error("Can't compare " + this + " to " + expected + ". Did you misspell a property name?");
	}
	if (expectedType !== "number") {
		if (expectedType !== "object") {
			throw new Error("Can't compare " + this + " to " + expectedType + ".");
		}
		if (!(expected instanceof Me) && !(expected instanceof Value)) {
			throw new Error("Can't compare " + this + " to " + oop.instanceName(expected) + " instances.");
		}
	}

	try {
		expected = this.convert(expected);

		var actualValue = this.value();
		var expectedValue = expected.value();

		if (actualValue.equals(expectedValue)) return "";

		return "Expected " + this.toString() + " (" + this.value() + ") " +
			"to be " + expected + " (" + expectedValue + ")" +
			", but was " + actualValue.diff(expectedValue);
	}
	catch (err) {
		throw new Error("Can't compare " + this + " to " + expected + ": " + err.message);
	}
};

Me.prototype.equals = function(equals) {
	// Descriptors aren't value objects. They're never equal to anything. But sometimes
	// they're used in the same places value objects are used, and this method gets called.
	return false;
};
