import _ from 'lodash'

const imageTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg'
]

export default {
    email: {
        type: 'email',
        message: 'Please insert a valid email address'
    },
    required: {
        required: true,
        message: 'This field is required'
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
