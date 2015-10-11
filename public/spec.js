describe('Controller: IdeaController', function(){
  var scope;
  var controller;
  var data;
  beforeEach(module('myApp.ideaMain'));
  beforeEach(inject(function ($controller, $rootScope, data) {
    scope = $rootScope.$new();
    data = data;
    controller = $controller('IdeaMainCtrl', {
      $scope: scope
    });
  }));

  it('assigns a person to the controller', function () {
    expect(scope.songs).to.equal('Here Comes The Sun');
  });

});
