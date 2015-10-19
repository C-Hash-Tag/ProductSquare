describe('basicService factory', function(){ 
    var basicService,
        databaseMock;
      
    beforeEach(function (){
        module('myApp', function($provide) {
          databaseMock = jasmine.createSpyObj('firebaseMock', ['createUser']);

          $provide.value('firebaseMock', databaseMock);
        });

        inject(function(_basicService_) {
          basicService = _basicService_;
        });
    });

    describe('basicService should be connected to the firebase factory', function(){
        it('basicService.sendData should be a function', function (){
            expect(angular.isFunction(basicService.sendData)).toBe(true);
        });
        it('expect firebaseMock.createUser to be called when basicService.sendData is called', function (){
            basicService.sendData("Mike", 19, "Makesquare");
            expect(databaseMock.createUser).toHaveBeenCalledWith("Mike", 19, "Makesquare");
        });
    });

});