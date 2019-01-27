import _ from 'lodash'

const imageTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg'
]

export default {
    email: {
        type: 'email',
        message: 'Bitte geben Sie eine E-Mail Adresse an'
    },
    required: {
        required: true,
        message: 'Dieses Feld muss ausgefüllt werden'
    },

    number: {
        message: 'Please insert a valid number',
        validator: (rule, value, callback)=>{

            const number = Number(value);
            const valid = !_.isNaN(number);

            if (!valid){
                return callback(valid);
            }
            return callback();
        },
    },
    image: {
        index: 'image',
        validator: (rule, value, callback)=>{

            let valid = value.reduce((acc, cur)=>{
                if (acc){
                    return imageTypes.indexOf(cur.type) > -1;
                }
                return acc;
            }, true);
            if (!valid){
                return callback(valid);
            }
            return callback();
        },
        message: 'Only images are allowed',
        required: false,
    }
}
