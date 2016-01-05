describe('Controllers', function(){

    beforeEach(module('mobilizeApp'));
    beforeEach(module('movementService'));

    describe('movementController', function(){
        var scope, ctrl, $httpBackend, $http, stateParams, movementId, query;
        var apiPath = 'http://localhost:8080/api/0.1/movements';

        describe('add', function(){
            beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Movement){
                $httpBackend = _$httpBackend_;
                scope = $rootScope.$new();
                ctrl = $controller('movementController',
                    {$scope:scope, Movement: Movement});
            }));

            it('should create a movement.', function(){
                $httpBackend.when('POST', (apiPath))
                    .respond({
                        id:"test",
                        name:"i see a nose",
                        description:"on every face",
                        image:"I see a nose in every place",
                        organizers:[{"name":"matt"},{"name":"sharothi"}]
                    });

                scope.movement.name = "i see a nose";
                scope.movement.description = "on every face";
                scope.movement.image = "I see a nose in every place";
                scope.movement.organizers = [{"name":"matt"},{"name":"sharothi"}];

                var result = scope.addMovement();

                $httpBackend.flush();

                expect(result.$$state.status).toBe(1);
                expect(scope.movement.id).toBe("test");
            });
        });

        describe('get', function(){
            beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$http_, Movement){
                $httpBackend = _$httpBackend_;
                $http = _$http_;
                movementId = 'test';
                stateParams = {movementId: movementId};
                scope = $rootScope.$new();
                ctrl = $controller('movementController',
                    {$scope:scope, $stateParams: stateParams, Movement: Movement});
            }));


            it('should get a movement.', function(){
                $httpBackend.when('GET', apiPath + '/' + movementId)
                    .respond({
                        id: 'test',
                        name:"i see a nose",
                        description:"on every face",
                        image:"I see a nose in every place",
                        organizers:[{"name":"matt"},{"name":"sharothi"}]
                    });

                $http.get(apiPath + '/' + movementId);
                $httpBackend.flush();

                expect(scope.movement.name).toBe("i see a nose");
            });
        });

        describe('modify', function(){
            beforeEach(inject(function($controller, $rootScope, _$httpBackend_, Movement){
                $httpBackend = _$httpBackend_;
                movementId = 'test';
                stateParams = {movementId: movementId};
                scope = $rootScope.$new();
                ctrl = $controller('movementController',
                    {$scope:scope, $stateParams: stateParams, Movement: Movement});
            }));

            it('should create a movement.', function(){
                $httpBackend.when('GET', apiPath + '/' + movementId)
                    .respond({
                        id: 'test',
                        name:"i see a nose",
                        description:"on every face",
                        image:"I see a nose in every place",
                        organizers:[{"name":"matt"},{"name":"sharothi"}]
                    });
                $httpBackend.when('PUT', (apiPath))
                    .respond({
                        id: 'test',
                        name:"i see a nose",
                        description:"foo",
                        image:"I see a nose in every place",
                        organizers:[{"name":"matt"},{"name":"sharothi"}]
                    });

                $http.get(apiPath + '/' + movementId);
                $httpBackend.flush();
                expect(scope.movement.description).toBe("on every face");

                scope.movement.description = "foo";
                var result = scope.modifyMovement();
                $httpBackend.flush();

                expect(result.$$state.status).toBe(1);
                expect(scope.movement.description).toBe("foo");
            });
        });

        /*describe('query', function(){
            beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$http_, Movement){
                $httpBackend = _$httpBackend_;
                $http = _$http_;
                query = 'iseeanose';
                stateParams = {query: query};
                scope = $rootScope.$new();
                ctrl = $controller('movementController',
                    {$scope:scope, $stateParams: stateParams, Movement: Movement});
            }));

            it('should return movement(s) upon a successful query.', function(){
                $httpBackend.when('GET', apiPath + '?q=' + query)
                    .respond([
                        {
                            id: 'test',
                            name:"i see a nose",
                            description:"on every face",
                            image:"I see a nose in every place",
                            organizers:[{"name":"matt"},{"name":"sharothi"}]
                        },
                        {
                            id: 'test2',
                            name:"i see a nose",
                            description:"2",
                            image:"I see a nose in every place",
                            organizers:[{"name":"matt"},{"name":"sharothi"}]
                        }
                    ]);
                console.log(JSON.stringify($http.pendingRequests));

                //$http.get(apiPath, {params: {q: query}});
                $http.get(apiPath, {params: {q: query}});
                console.log(JSON.stringify($http.pendingRequests));
                $httpBackend.flush();

                expect(scope.movements[0].id).toBe("test");
                expect(scope.movements[1].id).toBe("test2");
            });
        });*/
    });
});