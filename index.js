const parseDateHour = d3.timeParse("%A, %B %-d, %Y %I")

//generates a 3-Letter -dash- 3-Digit string (ABC-123, ZYX-987)
const makeRandomID = () => {
  var resLetters = "", resNums = '';
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "1234567890";

  for (var i = 0; i < 3; i++){
  	resLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  	resNums += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return `${resLetters}-${resNums}`;
}

//pick from 3 product codes
const makeRandomProduct = () => {
	let products = ['YC', 'SB', 'WH'];
	let digit = Math.round(Math.random() * (products.length - 1));
	return products[digit]
}

//expects array of [minVal, maxVal]
const getRandomNumber = (minMaxArr) => {
	return Math.floor(Math.random()*(minMaxArr[1]-minMaxArr[0]+1)+minMaxArr[0]) 
}

//adds minutes to a starting time
const addMinutes = (startDate, minutes) => {
	//	d3 time function
	//	https://github.com/d3/d3-time#interval_offset
    return d3.timeMinute.offset(startDate, minutes);
}

/*	A cumulative function, making a truck object returning : 
		{
			id: '',
			product: '',
			bushelCount: ''
		}
*/
const makeTruckObjs = (count) => {
	let resArr = []
	for(let i = 1; i <= count; i++){
		let thisTruck = {
			id: makeRandomID(),
			product: makeRandomProduct(),
			bushelCount: getRandomNumber([1350,1440])
		}
		resArr.push(thisTruck)
	}

	return resArr;
}

const randomDuration = {
	probe: getRandomNumber([2,6]),
	entScale: getRandomNumber([4,9]),
	dumpPit: getRandomNumber([10,18]),
	extScale: getRandomNumber([4,9]),
	travel: getRandomNumber([2,3])
}

/*
	Send a truck 'through' facilities -> accepts 
	a truck object
	an arr of facility names
	a startTime
*/
const sendThroughFacilities = (truckObj, facilitiesArr, startTime) => {
	// console.log('** ** ** ** ');
	// console.log('** ** SEND TRHOUGH FACILITY** ** ');
	// console.log('** ** ** ** ');

	let parsedStartString = parseDateHour(startTime)
	
	//time-keeper placeholders
	//time the facility will be open
	let parsedStarTime = parsedStartString;

	//
	let thisTruckNextFacilityStartTime = null;

	//hold facilities data for given truck
	let facilitesRes = [];

	//for each facility, push a facilityObject to the facilitiesRes array
	facilitiesArr.forEach((facility, ind) => {
		
		//check if facility was used prior
		// this should be true for EVERY truck after the first truck, as the facility will have been used
		let wasTruckInThisFacilityPrior = (facilityOpenTimes[facility] !== undefined) ? true : false;
		
		//decide to START facility-process from parameter startstring
		// OR from facility available start time
		parsedStarTime = (wasTruckInThisFacilityPrior) ? facilityOpenTimes[facility] : parsedStarTime;
		
		//random facility visit duration
		let thisFacilityDuration = randomDuration[facility];

		//random travel time after this facility
		let thisRandomTravelTime = randomDuration['travel']

		//set facility arrival Time
		// if the facility was booked prior, start when facility will be open
		// if facility was NOT booked, use calculated startTime from previous facility + random travel time
		let thisArrivalTime = (wasTruckInThisFacilityPrior) ? facilityOpenTimes[facility] : 
			(thisTruckNextFacilityStartTime) ? thisTruckNextFacilityStartTime : parsedStarTime
		
		//when truck leaves facility
		let thisLeaveTime = addMinutes(thisArrivalTime, thisFacilityDuration)


		/*
			Add Wait time 
			IF 
				NOT in probe &&
				wasTruckInThisFacilityPrior && 
				parsedStarTime is not equal to ( current truck prevFacility Leave + current truck prevFacilit Travel Time )

		*/
		let optWaitTime = null;
		if(facility !== 'probe'){
			if(wasTruckInThisFacilityPrior == true){
				let prevFacility = facilitesRes[ind - 1]
				let expectedArrivalTime = addMinutes(prevFacility.leaveTime, prevFacility.travelTimeAfter)
				console.log('expectedArrivalTime')
				console.log(expectedArrivalTime)
				
			}
		}
		
			
			
		
		//facility object
		let thisFacilityObj = {
			facility: facility,
			arrival: thisArrivalTime,
			duration: thisFacilityDuration,
			leaveTime: thisLeaveTime,
			travelTimeAfter: thisRandomTravelTime
		}

		//calculate the time @ end of facility visit
		let facilityEndTime = addMinutes(parsedStarTime, thisFacilityDuration)

		//set the time this truck starts visit at next facility
		thisTruckNextFacilityStartTime = addMinutes(thisLeaveTime, thisRandomTravelTime);
		
		//re-set the 'available time' that the facility will be open
		parsedStarTime = facilityEndTime;
		
		//set the facilit-open-time for this facility for the next truck in this facility to enter at
		facilityOpenTimes[facility] = thisLeaveTime
		
		//save this facility datat to facilitesRes for this truck
		facilitesRes.push(thisFacilityObj);
	})

	truckObj.facilities = facilitesRes;
	return truckObj;
}

	/*
		SAME truck NEEDS to be in Each location
		location.forEach(makeThisTruckVisitThere)

		process.
		1. make single truck obj
			- truckID
			- product (random [YC, SB, Wh])
			- bushels (random between 1350 && 1440)

		2. Put truck through facility
			FACILITY has 4 stops
				probe
				entScale
				dumpPit
				extScale

			NEEDS
			- Start time @ first facility (ex 7 am on a tuesday july 9 2018)
			- duration in each facilities
				- probe: rndm 2 - 6 min
				- entScale: rndm 4 - 9 min
				- dumpPit: rndm 10 - 18 min
				- extScale: rndm 4 - 9 min
			- travel time between first, second, & third facilities: rndm 2-3 min

	*/


	// truckID: "abc123",
	// product: random([YC, SB, Wh]),
	// location: 1, // 1-probe, 2-1stScale, etc
	// duration: random(7-32),
	// bushels: random(1350 - 1440)
	


//dummy date example
// date = d3.timeParse("%A, %B %-d, %Y %I")("Tuesday, July 9, 2018 7");
// console.log(addMinutes(date, 15))
// console.log('// - - - - - //')
let facilitiesArr = ['probe', 'entScale', 'dumpPit', 'extScale'] 

let facilityOpenTimes = {};

//dummy-truck-making example
let truckObjs = makeTruckObjs(2);
// console.log(truckObjs)
let truckWithFacilities = truckObjs.map(truckObj => {
	return sendThroughFacilities(truckObj, facilitiesArr, "Tuesday, July 9, 2018 7")
})

console.log('END: truckWithFacilities')
console.log(truckWithFacilities)


