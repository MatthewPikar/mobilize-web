(function () { "use strict"

angular.module('datetimeFactory',[]).factory('Datetime', [
    function Datetime() {
        function DateTime(value) { this.set(value) }
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
            this.toString =  function () {
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
        }).call(DateTime.prototype)

        return DateTime
    }])

}) ()