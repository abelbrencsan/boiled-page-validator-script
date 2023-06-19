/**
 * Validator - v1.1.0
 * Copyright 2021 Abel Brencsan
 * Released under the MIT License
 */

var Validator = function(options) {

	'use strict';

	// Test required options
	if (typeof options.fields == 'object') {
		for (var i = 0; i < options.fields.length; i++) {
			if (typeof options.fields[i].wrapper !== 'object') throw 'Validator field "wrapper" option must be an object';
			if (typeof options.fields[i].input !== 'object') throw 'Validator field "input" option must be an object';
			if (typeof options.fields[i].tests == 'object') {
				for (var j = 0; j < options.fields[i].tests.length; j++) {
					if (typeof options.fields[i].tests[j].name !== 'string') throw 'Validator field test "name" option must be a string';
				}
			}
			else {
				throw 'Validator field "tests" option must be an object';
			}
		}
	}

	// Default validator instance options
	var defaults = {
		fields: [],
		form: null,
		submitTrigger: null,
		submitters: [],
		setFocus: true,
		liveValidation: true,
		validationOnSubmit: true,
		initCallback: null,
		destroyCallback: null,
		allValidCallback: null,
		hasInvalidCallback: null,
		submitCallback: null,
		errorClass: 'has-error',
		successClass: 'has-success',
		submitClass: 'has-submitted'
	};

	// Extend validator instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Validator instance variables
	this.isAllValid = true;
	this.isInitialized = false;
	this.isSubmitted = false;

};

Validator.prototype = function () {

	'use strict';

	var validator = {

		/**
		 * Initialize validator. It creates events, adds classes and attributes related to validator. (public)
		 */
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				validator.handleEvents.call(this, event);
			};
			if (this.validationOnSubmit) {
				if (this.form) {
					this.form.setAttribute('novalidate', 'true');
					this.form.addEventListener('submit', this);
				}
			}
			for (var i = 0; i < this.fields.length; i++) {
				for (var j = 0; j < this.fields[i].tests.length; j++) {
					if (this.fields[i].tests[j].name == 'required') {
						this.fields[i].input.setAttribute('aria-required', 'true');
					}
				}
				if (this.fields[i].validateDisabled !== true) {
					this.fields[i].validateDisabled = false;
				}
				if (typeof this.fields[i].group == 'undefined') {
					this.fields[i].group = null;
				}
				this.fields[i].isValid = true;
				this.fields[i].messages = [];
				if (this.liveValidation) {
					this.fields[i].input.addEventListener('blur', this);
					this.fields[i].input.addEventListener('focus', this);
				}
			}
			if (this.submitTrigger) {
				for (var i = 0; i < this.submitters.length; i++) {
					this.submitters[i].addEventListener('click', this);
				}
			}
			if (this.initCallback) this.initCallback.call(this);
			this.isInitialized = true;
		},

		/**
		 * Add new field to existing ones. It creates events, adds classes and attributes to make field validation works. (public)
		 * @param field object
		 */
		addField: function(field) {
			for (var j = 0; j < field.tests.length; j++) {
				if (field.tests[j].name == 'required') {
					field.input.setAttribute('aria-required', 'true');
				}
			}
			field.isValid = true;
			field.messages = [];
			if (this.liveValidation) {
				field.input.addEventListener('blur', this);
				field.input.addEventListener('focus', this);
			}
			this.fields.push(field);
		},

		/**
		 * Remove fields by given index. It removes events, classes and attributes related to removed fields. (public)
		 * @param index number
		 * @param length number
		 */
		removeFields: function(index, length) {
			if (typeof length == 'undefined') {
				length = 1;
			}
			this.fields.splice(index, length);
		},

		/**
		 * Remove fields by given group. It removes events, classes and attributes related to removed fields. (public)
		 * @param group string
		 */
		removeFieldsByGroup: function(group) {
			this.fields = this.fields.filter(function(field) {
				return field.group !== group; 
			});
		},

		/**
		 * Validate given field against its tests. It sets classes, attributes and messages based on the result. (public)
		 * @param field object
		 */
		validate: function(field) {
			if (!field.validateDisabled && field.input.hasAttribute('disabled')) return true;
			field.wrapper.classList.remove(this.errorClass);
			field.wrapper.classList.remove(this.successClass);
			field.isValid = true;
			field.messages = [];
			for (var i = 0; i < field.tests.length; i++) {
				for (var j = 0; j < validator.tests.length; j++) {
					if (field.tests[i].name == validator.tests[j].name) {
						if (!validator.tests[j].test(field.input, field.tests[i].parameter)) {
							field.isValid = false;
							if (field.tests[i].message) field.messages.push(field.tests[i].message);
						}
					}
				}
			}
			if (field.isValid) {
				field.wrapper.classList.add(this.successClass);
				if (field.validCallback) field.validCallback.call(this, field);
			}
			else {
				field.wrapper.classList.add(this.errorClass);
				if (field.invalidCallback) field.invalidCallback.call(this, field);
			}
			return field.isValid;
		},

		/**
		 * Remove related classes, attributes and messages from given field. (public)
		 * @param field object
		 */
		devalidate: function(field) {
			field.wrapper.classList.remove(this.errorClass);
			field.wrapper.classList.remove(this.successClass);
			field.isValid = true;
			if (field.validCallback) field.validCallback.call(this, field);
		},

		/**
		 * Validate all fields against their own tests. It sets classes, attributes and messages of each item based on its result. (public)
		 */
		validateAll: function() {
			var label, labelElem;
			var firstErrorIndex = null;
			this.isAllValid = true;
			for (var i = 0; i < this.fields.length; i++) {
				if (!validator.validate.call(this, this.fields[i])) {
					this.isAllValid = false;
					this.fields[i].input.setAttribute('aria-invalid', 'true');
					label = '';
					if (this.fields[i].input.id) {
						labelElem = document.querySelector('label[for=' + this.fields[i].input.id + ']');
						if (labelElem) {
							label = labelElem.innerText + ' - ';
						}
					}
					if (this.fields[i].messages.length) this.fields[i].input.setAttribute('aria-label', label + this.fields[i].messages[0]);
					if (firstErrorIndex === null) firstErrorIndex = i;
				}
				else {
					this.fields[i].input.setAttribute('aria-invalid', 'false');
					this.fields[i].input.removeAttribute('aria-label');
				}
			}
			if (firstErrorIndex !== null && this.setFocus) this.fields[firstErrorIndex].input.focus();
			if (this.allValidCallback && this.isAllValid) this.allValidCallback.call(this);
			if (this.hasInvalidCallback && !this.isAllValid) this.hasInvalidCallback.call(this);
			return this.isAllValid;
		},

		/**
		 * Remove related classes, attributes and messages from all fields. (public)
		 */
		devalidateAll: function() {
			for (var i = 0; i < this.fields.length; i++) {
				validator.devalidate.call(this, this.fields[index]);
			}
		},

		/**
		 * Validate field against its tests by given index. It sets classes, attributes and messages based on the result. (public)
		 * @param index number
		 */
		validateByIndex: function(index) {
			validator.validate.call(this, this.fields[index]);
		},

		/**
		 * Remove related classes, attributes and messages from field by given index. (public)
		 * @param index number
		 */
		devalidateByIndex: function(index) {
			validator.devalidate.call(this, this.fields[index]);
		},

		/**
		 * Validate all fields in a given group against their own tests. It sets classes, attributes and messages of each item based on its result. (public)
		 * @param group string
		 */
		validateByGroup: function(group) {
			for (var i = 0; i < this.fields.length; i++) {
				if (this.fields[i].group === group) {
					validator.validate.call(this, this.fields[i]);
				}
			}
		},

		/**
		 * Remove all related classes, attributes and messages from all fields in a group. (public)
		 * @param group string
		 */
		devalidateByGroup: function(group) {
			for (var i = 0; i < this.fields.length; i++) {
				if (this.fields[i].group === group) {
					validator.devalidate.call(this, this.fields[i]);
				}
			}
		},

		/**
		 * Validate field against its tests by given input ID. It sets classes, attributes and messages based on the result. (public)
		 * @param id string
		 */
		validateByInputId: function(id) {
			for (var i = 0; i < this.fields.length; i++) {
				if (this.fields[i].input.id === id) {
					validator.validate.call(this, this.fields[i]);
					return;
				}
			}
		},

		/**
		 * Remove related classes, attributes, messages from field by given input ID. (public)
		 * @param id string
		 */
		devalidateByInputId: function(id) {
			for (var i = 0; i < this.fields.length; i++) {
				if (this.fields[i].input.id === id) {
					validator.devalidate.call(this, this.fields[i]);
					return;
				}
			}
		},

		/**
		 * Handle events. (private)
		 * On submit trigger click: Simulate click event on submit trigger.
		 * On form submit: Validate all fields and prevent submission when there is at least one invalid field.
		 * On field input blur: Validate field when `liveValidation` is true.
		 * On field input focus: Remove error and success classes when `liveValidation` is true.
		 * @param event object
		 */
		handleEvents: function(event) {
			switch(event.type) {
				case 'click':
					if (this.submitTrigger) {
						for (var i = 0; i < this.submitters.length; i++) {
							if (event.target == this.submitters[i]) {
								event.preventDefault();
								this.submitTrigger.click();
							}
						}
					}
					break;
				case 'submit':
					if (this.form) {
						if (event.target == this.form) {
							if (!this.isSubmitted) {
								validator.validateAll.call(this);
								if (!this.isAllValid) {
									event.preventDefault();
								}
								else {
									this.isSubmitted = true;
									this.form.classList.add(this.submitClass);
									if (this.submitCallback) this.submitCallback.call(this, event);
								}
							}
						}
					}
					break;
				case 'blur':
					for (var i = 0; i < this.fields.length; i++) {
						if (event.target == this.fields[i].input) {
							if (validator.validate.call(this, this.fields[i])) {
								for (var j = 0; j < this.fields.length; j++) {
									if (this.fields[j].validateOnTrue === this.fields[i].input.name) {
										validator.validate.call(this, this.fields[j]);
									}
								}
							}
						}
					}
					break;
				case 'focus':
					for (var i = 0; i < this.fields.length; i++) {
						if (event.target == this.fields[i].input) {
							this.fields[i].wrapper.classList.remove(this.errorClass);
							this.fields[i].wrapper.classList.remove(this.successClass);
						}
					}
					break;
			}
		},

		/**
		 * Destroy validator. It removes all related classes, attributes and events. (public)
		 */
		destroy: function() {
			if (!this.isInitialized) return;
			if (this.form) {
				if (this.validationOnSubmit) {
					this.form.removeAttribute('novalidate');
					this.form.removeEventListener('submit', this);
				}
				this.form.classList.remove(this.submitClass);
			}
			for (var i = 0; i < this.fields.length; i++) {
				this.fields[i].input.removeAttribute('aria-required');
				this.fields[i].input.removeAttribute('aria-invalid');
				this.fields[i].input.removeAttribute('aria-label');
				this.fields[i].wrapper.classList.remove(this.errorClass);
				this.fields[i].wrapper.classList.remove(this.successClass);
				if (this.liveValidation) {
					this.fields[i].input.removeEventListener('blur', this);
					this.fields[i].input.removeEventListener('focus', this);
				}
			}
			for (var i = 0; i < this.submitters.length; i++) {
				this.submitters[i].removeEventListener('click', this);
			}
			this.isAllValid = true;
			this.isInitialized = false;
			this.isSubmitted = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		},

		/**
		 * Validation tests (private)
		 */
		tests: [
			{
				// Check field value is not empty.
				name: 'required',
				test: function (field, parameter) {
					if (field.getAttribute('type') === 'radio' || field.getAttribute('type') === 'checkbox') {
						return document.querySelectorAll('[name="' + field.getAttribute('name') + '"]:checked').length > 0;
					}
					return field.value.length > 0;
				}
			},
			{
				// Check field value is not empty when the value of element with the name given in the parameter is filled.
				name: 'required-filled',
				test: function (field, parameter) {
					return !validator.tests[0].test(document.querySelector('[name="' + parameter.replace('*.', '') + '"]')) || validator.tests[0].test(field);
				}
			},
			{
				// Check field value is not empty when the value of element with ID given in the parameter is filled.
				name: 'required-filled-id',
				test: function (field, parameter) {
					return !validator.tests[0].test(document.getElementById(parameter)) || validator.tests[0].test(field);
				}
			},
			{
				// Check field value is not empty when the value of element with the name given in the parameter is empty.
				name: 'required-empty',
				test: function (field, parameter) {
					return validator.tests[0].test(document.querySelector('[name="' + parameter.replace('*.', '') + '"]')) || validator.tests[0].test(field);
				}
			},
			{
				// Check field value is not empty when the value of element with ID given in the parameter is empty.
				name: 'required-empty-id',
				test: function (field, parameter) {
					return validator.tests[0].test(document.getElementById(parameter)) || validator.tests[0].test(field);
				}
			},
			{
				// Check field value is float.
				name: 'float',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value == parseFloat(field.value);
				}
			},
			{
				// Check field value is integer.
				name: 'integer',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value == String(parseInt(field.value, 10));
				}
			},
			{
				// Check field value is zero (0) or one (1).
				name: 'bool',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value === '0' || field.value === '1';
				}
			},
			{
				// Check field value is greater than or equal to the number given in the parameter.
				name: 'min-value',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return parseFloat(field.value) >= parseFloat(parameter);
				}
			},
			{
				// Check field value is less than or equal to the number given in the parameter.
				name: 'max-value',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return parseFloat(field.value) <= parseFloat(parameter);
				}
			},
			{
				// Check field value's length is equal to the number given in the parameter.
				name: 'length',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value.length === parseInt(parameter, 10);
				}
			},
			{
				// Check field value's length is more than the number given in the parameter.
				name: 'min-length',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value.length >= parseInt(parameter, 10);
				}
			},
			{
				// Check field value's length is less than the number given in the parameter.
				name: 'max-length',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value.length <= parseInt(parameter, 10);
				}
			},
			{
				// Check field value passes the regular expression given in the parameter.
				name: 'pattern',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return new RegExp(parameter).test(field.value);
				}
			},
			{
				// Check field value is a valid E-mail address.
				name: 'email',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return /(^[a-zA-Z0-9._]+[@]{1}[a-z0-9.-]+[.][a-z]+$)/.test(field.value);
				}
			},
			{
				// Check field value matches the value of element with the name given in the parameter.
				name: 'matches',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value === document.querySelector('[name="' + parameter.replace('*.', '') + '"]').value;
				}
			},
			{
				// Check field value is greater than the value of element with the name given in the parameter.
				name: 'greater',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value > document.querySelector('[name="' + parameter.replace('*.', '') + '"]').value;
				}
			},
			{
				// Check field value is lower than the value of element with the name given in the parameter.
				name: 'lower',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					return field.value < document.querySelector('[name="' + parameter.replace('*.', '') + '"]').value;
				}
			},
			{
				// Check field value is included in a comma separated list given in the parameter.
				name: 'in-array',
				test: function (field, parameter) {
					if (!validator.tests[0].test(field)) return true;
					var array = parameter.split(/,\s*/);
					return array.indexOf(field.value) > -1;
				}
			}
		]

	};

	return {
		init: validator.init,
		addField: validator.addField,
		removeFields: validator.removeFields,
		removeFieldsByGroup: validator.removeFieldsByGroup,
		validate: validator.validate,
		devalidate: validator.devalidate,
		validateAll: validator.validateAll,
		devalidateAll: validator.devalidateAll,
		validateByIndex: validator.validateByIndex,
		devalidateByIndex: validator.devalidateByIndex,
		validateByGroup: validator.validateByGroup,
		devalidateByGroup: validator.devalidateByGroup,
		validateByInputId: validator.validateByInputId,
		devalidateByInputId: validator.devalidateByInputId,
		destroy: validator.destroy
	};

}();