# Boiled Page validator script

A simple, lightweight and customizable form validator JavaScript module for Boiled Page frontend framework.

## Install

Place `validator.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts.

## Usage

To create a new validator instance, call `Validator` constructor the following way:

```js
// Create new validator instance
var validator = new Validator(options);

// Initialize validator instance
validator.init();
```

## Options

Available options for validator constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`fields` | Array | [] | Yes | Array of validator fields. `wrapper`, `input` and `tests` properties must be defined for each item.
`form` | Object | null | No | Form that contains fields.
`submitTrigger` | Object | null | No | When one or more `submitters` are given, and user clicks on one of them, a click event is simulated on submit trigger.
`submitters` | Array | [] | No | A `NodeList` object. Clicking on a property simulates a click event on submit trigger.
`setFocus` | Boolean | true | No | Set focus to the input of first field with a validation error when all fields are validated.
`liveValidation` | Boolean | true | No | Validate field after its input loses focus. 
`validationOnSubmit` | Boolean | true | No | Validate fields on form submission. 
`initCallback` | Function | null | No | Callback function after validator is initialized.
`destroyCallback` | Function | null | No | Callback function after validator is destroyed.
`allValidCallback` | Function | null | No | Callback function when all fields are valid after validation.
`hasInvalidCallback` | Function | null | No | Callback function when there is at least one invalid field after validation.
`submitCallback` | Function | null | No | Callback function before submission when all fields are valid.
`errorClass` | String | 'has-error' | No | Class added to wrapper when field is invalid.
`successClass` | String | 'has-success' | No | Class added to wrapper when field is valid.
`submitClass` | String | 'has-submitted' | No | Class added to form after it is submitted and all fields are valid.

Available options for a field object:

Option| Type | Required | Description
------|------|----------|------------
`wrapper` | Object | Yes | Error and success classes are added to wrapper on validation.
`input` | Object  | Yes | Value of input that will be validated.
`tests` | Array | Yes | Array of tests. `name` property must be defined for each test.
`group` | String | No | Group name of field.

Available options for a field test object:

Option| Type | Required | Description
------|------|----------|------------
`name` | String | Yes | Name of test.
`parameter` | Mixed  | No | Parameter passed to test.
`message` | String | No | Message when validation fails.

## Tests

Name| Parameter | Description
----|-----------|------------
`required` | - | Check field value is not empty.
`required-filled` | Name of an input element | Check field value is not empty when the value of element with the name given in the parameter is filled.
`required-empty` | Name of an input element | Check field value is not empty when the value of element with the name given in the parameter is empty.
`float` | - | Check field value is float.
`integer` | - | Check field value is integer.
`bool` | - | Check field value is zero (0) or one (1).
`min-value` | Number | Check field value is greater than or equal to the number given in the parameter.
`max-value` | Number | Check field value is less than or equal to the number given in the parameter.
`length` | Number | Check field value's length is equal to the number given in the parameter.
`min-length` | Number | Check field value's length is more than the number given in the parameter.
`max-length` | Number | Check field value's length is less than the number given in the parameter.
`pattern` | Regular expression | Check field value passes the regular expression given in the parameter.
`email` |  | Check field value is a valid E-mail address.
`matches` | Name of an input element | Check field value matches the value of element with the name given in the parameter.
`greater` | Name of an input element | Check field value is greater than the value of element with the name given in the parameter.
`lower` | Name of an input element | Check field value is lower than the value of element with the name given in the parameter.
`in-array` | Comma separated list | Check field value is included in a comma separated list given in the parameter.

## Methods

### Initialize validator

`init()` - Initialize validator. It creates events, adds classes and attributes related to validator.

### Add field to validator

`addField(field)` - Add new field to existing ones. It creates events, adds classes and attributes to make field validation works.

Parameter | Type | Required | Description
----------|------|----------|------------
`field` | Object | Yes | 

### Remove fields from validator by index

`removeFields(index, length)` - Remove fields by given index. It removes events, classes and attributes related to removed fields.

Parameter | Type | Required | Description
----------|------|----------|------------
`index` | Number | Yes | Index of field at which to start removing.
`length` | Number | No | Number of fields to remove from `index`.

### Remove fields from validator by group

`removeFieldsByGroup(group)` - Remove fields by given group. It removes events, classes and attributes related to removed fields.

Parameter | Type | Required | Description
----------|------|----------|------------
`group` | String | Yes | Group of removable items.

### Validate field

`validate(field)` - Validate given field against its tests. It sets classes, attributes and messages based on the result.

Parameter | Type | Required | Description
----------|------|----------|------------
`field` | Object | Yes | A field object.

### Devalidate field

`devalidate(field)` - Remove related classes, attributes and messages from given field.

Parameter | Type | Required | Description
----------|------|----------|------------
`field` | Object | Yes | A field object.

### Validate all fields

`validateAll()` - Validate all fields against their own tests. It sets classes, attributes and messages of each item based on its result.

### Devalidate all fields

`devalidateAll()` - Remove related classes, attributes and messages from all fields.

### Validate field by index

`validateByIndex(index)` - Validate field against its tests by given index. It sets classes, attributes and messages based on the result.

Parameter | Type | Required | Description
----------|------|----------|------------
`index` | Number | Yes | Index of field.

### Devalidate field by index

`devalidateByIndex(index)` - Remove related classes, attributes and messages from field by given index.

Parameter | Type | Required | Description
----------|------|----------|------------
`index` | Number | Yes | Index of field.

### Validate fields by group

`validateByGroup(group)` - Validate all fields in a given group against their own tests. It sets classes, attributes and messages of each item based on its result.

Parameter | Type | Required | Description
----------|------|----------|------------
`group` | String | Yes | Group of fields to be validated.

### Devalidate fields by group

`devalidateByGroup(group)` - Remove all related classes, attributes and messages from all fields in a group.

Parameter | Type | Required | Description
----------|------|----------|------------
`group` | String | Yes | Group of fields to be devalidated.

### Validate field by input ID

`validateByInputId(id)` - Validate field against its tests by given input ID. It sets classes, attributes and messages based on the result.

Parameter | Type | Required | Description
----------|------|----------|------------
`id` | Number | Yes | Field input ID to be validated.

### Devalidate field by input ID

`devalidateByInputId(id)` - Remove related classes, attributes, messages from field by given input ID.

Parameter | Type | Required | Description
----------|------|----------|------------
`id` | Number | Yes | Field input ID to be devalidated.

### Destroy validator

`destroy()` - Destroy validator. It removes all related classes, attributes and events.

### Check validator is initialized

`getIsInitialized()` - Check validator is initialized or not.

### Check all fields are valid

`getIsAllValid()` - Check all fields are valid or not.

### Get all fields

`getFields()` - Get all fields.

## Examples

### Example 1

Te following example shows 4 form elements inside a form. You will also need to add form and button components to make the following example works properly.

-   Form component: <https://www.github.com/abelbrencsan/boiled-page-form-component>
-   Button component: <https://www.github.com/abelbrencsan/boiled-page-button-component>

```html
<form id="clientForm" class="form" method="get" action="">
  <ul class="grid grid--uniform grid--gutter grid--gutter--half">
    <li class="grid-col grid-col--1of2">
      <div id="emailWrapper" class="form-item is-required">
        <label class="form-label" for="email">E-mail</label>
        <input name="email" id="email" class="form-input" type="email" />
      </div>
    </li>
    <li class="grid-col grid-col--1of2">
      <div id="countryWrapper" class="form-item is-required">
        <label class="form-label" for="country">Country</label>
        <select name="country" id="country" class="form-input form-input--select">
          <option value="">Choose country</option>
          <option value="austria">Austria</option>
          <option value="croatia">Croatia</option>
          <option value="hungary">Hungary</option>
          <option value="italy">Italy</option>
          <option value="romania">Romania</option>
          <option value="serbia">Serbia</option>
          <option value="slovakia">Slovakia</option>
          <option value="ukraine">Ukraine</option>
        </select>
      </div>
    </li>
    <li class="grid-col grid-col--1of2">
      <div id="zipWrapper" class="form-item is-required">
        <label class="form-label" for="zip">ZIP</label>
        <input name="zip" id="zip" class="form-input" type="text" />
      </div>
    </li>
    <li class="grid-col grid-col--1of2">
      <div id="cityWrapper" class="form-item is-required">
        <label class="form-label" for="city">City</label>
        <input name="city" id="city" class="form-input" type="text" />
      </div>
    </li>
    <li class="grid-col grid-col--full text-center">
      <button type="submit" id="submitClientForm" class="button">Submit</button>
    </li>
  </ul>
</form>
```

Place the following code inside `assets/js/app.js` to initialize validator for form elements.

```js
// Callback funtion after a field is valid
var validCallback = function(field) {
  field.wrapper.removeAttribute('data-label');
};

// Callback funtion after a field is invalid
var invalidCallback = function(field) {
  if (field.messages.length) {
    field.wrapper.setAttribute('data-label', field.messages[0]);
  }
};

// Initialize validator
var validator = new Validator({
  form: document.getElementById('clientForm'),
  fields: [
    {
      wrapper: document.getElementById('emailWrapper'),
      input: document.getElementById('email'),
      tests: [
        {
          name: 'required',
          message: 'Field is required'
        },
        {
          name: 'email',
          message: 'Field is not a valid e-mail address'
        }
      ],
      validCallback: validCallback,
      invalidCallback: invalidCallback
    },
    {
      wrapper: document.getElementById('countryWrapper'),
      input: document.getElementById('country'),
      tests: [
        {
          name: 'required',
          message: 'Field is required'
        },
        {
          name: 'in-array',
          parameter: 'croatia,hungary,italy,romania,serbia,slovakia,ukraine',
          message: 'Selected option is not availble'
        }
      ],
      validCallback: validCallback,
      invalidCallback: invalidCallback
    },
    {
      wrapper: document.getElementById('zipWrapper'),
      input: document.getElementById('zip'),
      tests: [
        {
          name: 'required',
          message: 'Field is required'
        },
        {
          name: 'integer',
          message: 'Field must be a number'
        },
        {
          name: 'length',
          parameter: 4,
          message: 'Field must be 4 characters long'
        }
      ],
      validCallback: validCallback,
      invalidCallback: invalidCallback
    },
    {
      wrapper: document.getElementById('cityWrapper'),
      input: document.getElementById('city'),
      tests: [
        {
          name: 'required',
          message: 'Field is required'
        }
      ],
      validCallback: validCallback,
      invalidCallback: invalidCallback
    }
  ],
  submitTrigger: document.getElementById('submitClientForm'),
  submitCallback: function() {
    if (this.submitTrigger) {
      this.submitTrigger.disabled = true;
    }
  }
});
validator.init();
```