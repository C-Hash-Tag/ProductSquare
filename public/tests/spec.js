describe('Data Factory', function(){ //describe your object type
    
    var data;

    beforeEach(function (){
        module('myApp.data');
        inject(function(_data_){
            data = _data_;
        });
    });
    
    it('it should have a createUser function', function(){
        expect(angular.isFunction(data.createUser)).toBe(true);
    });
});