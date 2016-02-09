'use strict'

var eventsController = angular.module('eventsController', [])

eventsController.controller('eventsController', ['$scope', '$stateParams', '$state', 'Event',
    function($scope, $stateParams, $state, Event) {
        $scope.movementId = $stateParams.movementId
        // State flow
        function State (zones){
            this._zones = {}
            for(var z= 0, len=zones.length; z<len; z++){ this._zones[zones[z]] = false }
        }
        ( function () {
            this.off = function () {
                for (var zone in this._zones)
                    if (this._zones.hasOwnProperty(zone)) this._zones[zone] = false
            }
            this.toggle = function (zone) {
                this._zones[zone] = !this._zones[zone]
            }
            this.set = function (zone) {
                var currentState = this._zones[zone]
                this.off()
                this._zones[zone] = !currentState
            }
            this.get = function (state){ return this._zones[state] }
        }).call(State.prototype)
        $scope.eventState = new State(['edit','new','view'])

        function Datetime(value) { this.set(value) }
        ( function () {
            this.DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            this.MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
            this.DATES = []
            for (var d=1; d<=31; d++){ this.DATES.push(d) }

            this.YEARS = []
            var now = new Date(Date.now())
            for (var y=now.getFullYear(); y<=(now.getFullYear()+10); y++){ this.YEARS.push(y) }

            var _datetime
            var month, date, year, monthError=false, dateError=false, yearError=false

            this.set =  function(value){
                _datetime = new Date(value)
                year = _datetime.getFullYear()
                month = this.MONTHS[_datetime.getMonth()]
                date = _datetime.getDate()
            }
            this.get =  function () {
                if(!month || !date || !year || monthError || dateError || yearError) return ''
                else return _datetime.toISOString()
            }

            Object.defineProperties(this, {
                day:{get: function () {return this.DAYS[_datetime.getDay()]}},
                month: {
                    get: function () {return month},
                    set: function (newMonth) {
                        if (newMonth === '') monthError=false
                        else monthError=true

                        for (var i= 0; i<12; i++){
                            if (this.MONTHS[i].toLowerCase() === newMonth.toLowerCase()) {
                                _datetime.setMonth(i)
                                monthError=false
                                break
                            }
                        }
                        month = newMonth
                    }
                },
                monthError:{get:function(){return monthError}},
                date: {
                    get: function () {return date},
                    set: function (newDate) {
                        if (!newDate) dateError=false
                        else dateError=true

                        if ((newDate > 0) && (newDate <= 31)) {
                            _datetime.setDate(newDate)
                            dateError = false
                        }
                        date = newDate
                    }
                },
                dateError:{get:function(){return dateError}},
                suffix:{get: function () {
                    var date = _datetime.getDate()
                    switch (date){
                        case 1: return 'st'
                        case 2: return 'nd'
                        case 3: return 'rd'
                        default: return 'th'
                    }
                }},
                year: {
                    get: function () {return year},
                    set: function (newYear) {
                        if (!newYear) yearError=false
                        else yearError=true

                        if ((newYear > 1900) && (newYear < 2100)) {
                            _datetime.setYear(newYear)
                            yearError = false
                        }
                        year = newYear
                    }
                },
                yearError:{get:function(){return yearError}},
                hours: {
                    get: function () {return _datetime.getHours()},
                    set: function (hours) { _datetime.setHours(hours)}
                },
                minutes: {
                    get: function () {return _datetime.getMinutes()},
                    set: function (minutes) { _datetime.setMinutes(minutes)}
                }
            })
        }).call(Datetime.prototype)

        // Initialization
        if ($stateParams.eventId) {
            $scope.event = loadEvent($stateParams.eventId, function(res) {
                $scope.date = new Datetime(res.date)
            })
            $scope.eventState.set('view')
        }
        else {
            $scope.event = new Event()
            $scope.date = new Datetime(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000)
            $scope.eventState.set('new')
            $scope.eventState.toggle('edit')
        }

        // Resource Control
        $scope.loadEvent = loadEvent
        function loadEvent (eventId, res) {
            var event = new Event()
            Event.get({id: eventId}).$promise
                .then(function (response) {
                    angular.extend(event, response)
                    res(event)
                }).catch(function(error){ $scope.error = error })
            return event
        }
        $scope.queryEvents = function(query) {
            var events = [], q = query ? {query: query} : {}
            Event.query(q).$promise
                .then(function (response) {
                    if (Array.isArray(response)) {
                        for (var e = 0, len = response.length; e < len; e++) {
                            events[e] = response[e]
                            events[e].date = response[e].date ? new Date(response[e].date) : ''
                        }
                        $scope.events = events
                    }
                    else  $scope.events = []
                }).catch(function(error) {
                    console.log(error)
                    $scope.error = error
                })

            return $scope.events
        }
        $scope.addEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.sourceId = $stateParams.movementId
            $scope.event.$add()
                .then(function(response){
                    angular.extend($scope.event, response)
                    $scope.go('movement.overview',{movementId:$stateParams.movementId})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.modifyEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.$modify()
                .then(function(response){
                    angular.extend($scope.event, response)
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.deleteEvent = function () {
            $scope.event.$remove()
                .then(function(response){
                    return true
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state){
            $state.go(state)
        }
    }])