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
const makeRandomBushelCount = (minMaxArr) => {
	return Math.floor(Math.random()*(minMaxArr[1]-minMaxArr[0]+1)+minMaxArr[0]) 
}
	/*
		SAME truck NEEDS to be in Each location
		location.forEach(makeThisTruckVisitThere)

		process.
		1. make single truck obj
			- truckID
			- product (random [YC, SB, Wh])
			- bushels (random between 1350 && 1440)

		2. Copy truck, 
			make 4 new objects per truck
			1 per location ([probe, entScale, dumpPit, extScale]). 
			ADD:
			- location name
			- time IN loc ( random between 7 - 26 min) mins
			- travel time to next stop 	// IF first 3 locations only
			// - timestamp ENTERED location
			// - timestamp LEFT location (enter + @)

		Connecting time between trucks & times
		SAVE a 'global' timeList
		LAST EMPTY:
			- [probe, entScale, dumpPit, extScale]: time after location

	*/


	// truckID: "abc123",
	// product: random([YC, SB, Wh]),
	// location: 1, // 1-probe, 2-1stScale, etc
	// duration: random(7-32),
	


	//BUSHELS - between 1350 && 1440

const makeTrucks = (count) => {
	let resArr = []
	for(let i = 1; i <= count; i++){
		let thisTruck = {
			id: makeRandomID(),
			product: makeRandomProduct(),
			bushelCount: makeRandomBushelCount([1350,1440])
		}
		resArr.push(thisTruck)
	}

	return resArr;
}


console.log(makeTrucks(30))
let dummyTrucks = makeTrucks(3)