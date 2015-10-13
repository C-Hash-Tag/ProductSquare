describe('Data Factory', function(){ //describe your object type
    
    var data;

    beforeEach(module('myApp.data'));
    beforeEach(inject(function (_data_) {
        data = _data_;
        console.log(data);
    }));

    describe('Constructor', function () {

        it('testing testing', function () {
            var method = data.createUser
            expect(method).to.exist;
        });

    });
    

});