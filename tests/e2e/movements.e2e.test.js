'use strict';

describe('Mobilize', function() {
    describe('movements', function(){
        describe('add', function() {
            beforeEach(function() {
                browser.get('app/movement/new');
            });

            it('Should add a movement.', function () {
                element(by.model('movement.name')).sendKeys("foo");
                element(by.model('movement.description')).sendKeys("foo described");
                element(by.id('addMovement')).click();

                expect(element(by.id(movementStatus)).getText()).
                    toEqual('Movment added');
            });
    });
  });

});
