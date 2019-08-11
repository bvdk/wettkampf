import WarnErrMinMaxAttributeFactory from "./warn-err-min-max-attribute-factory";

const attributesMock = [
  {
    "attribute": {
      "title": "S1 Press",
      "name": "S1_Press",
      "categories": ['sputter', 'sputter1']
    },
    "warning": {
      "min": {
        "attribute": {
          "name": "S1_Press_warn_min",
          "title": "Druck",
          "type": "Float"
        },
        "value": 1.2
      },
      "max": {
        "attribute": {
          "name": "S1_Press_warn_max",
          "title": "Druck",
          "type": "Float"
        },
        "value": 2e-5
      }
    },
    "error": {
      "min": {
        "attribute": {
          "name": "S1_Press_err_min",
          "title": "Druck",
          "type": "Float"
        },
        "value": 1
      },
      "max": {
        "attribute": {
          "name": "S1_Press_err_max",
          "title": "Druck",
          "type": "Float"
        },
        "value": 2
      }
    }
  }
]

test('generate min max',()=>{


  const result = WarnErrMinMaxAttributeFactory.generateFormAttributes(attributesMock);

  expect(Object.keys(result).length).toBe(1);
  expect(result.S1_Press).toEqual({
    name: 'S1_Press',
    title: 'S1 Press',
    type: 'limit',
    categories: ['sputter', 'sputter1'],
    config: {
      warning: {
        min: {
          name: 'S1_Press_warn_min',
          title: "Min",
          type: 'float'
        },
        max: {
          type: 'float',
          title: "Max",
          name: 'S1_Press_warn_max',
        }
      },
      error: {
        min: {
          name: 'S1_Press_err_min',
          title: "Min",
          type: 'float'
        },
        max: {
          name: 'S1_Press_err_max',
          title: "Max",
          type: 'float'
        }
      }
    }
  });

})

test('test min max values',()=> {

  const result = WarnErrMinMaxAttributeFactory.getValues(attributesMock);

  expect(Object.keys(result).length).toBe(4);
  expect(result.S1_Press_warn_min).toBe(1.2);
  expect(result.S1_Press_warn_max).toBe(2e-5);
  expect(result.S1_Press_err_min).toBe(1);
  expect(result.S1_Press_err_max).toBe(2);

});
