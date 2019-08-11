//@flow

import findKey from "./findKey";

describe('Toast', () => {

    it('should find key deep', () => {

        const key = findKey({
            foo: {
                bar: 'test'
            }
        }, 'bar')
        expect(key).toEqual('test');

    });
});
