'use strict';

var postcodeData = {};

// place to hold result data
postcodeData.PATH_P = '';
postcodeData.PATH_MOT = '';
postcodeData.ERR_MSG = 'Postcode Not Found';
postcodeData.ERR_LOAD = 'Error loading mot stations data';
postcodeData.coords = null;
postcodeData.stations = null;

/**
* Constructor creates a new pair of coordinates
* this.east and this.north
*/
function Coordinates(easting, northing) {
  this.east = easting;
  this.north = northing;
}

/**
 * Calculates the distance between 2 pairs of coordinates
 * returns distance in miles
 */
function getDistance(coord1, coord2) {
  var diffE = coord1.east - coord2.east;
  var diffN = coord1.north - coord2.north;
  
  var distKm = Math.sqrt(diffE*diffE + diffN*diffN);
  var distanceMiles = distKm / 1000 / 1.6;
  
  return distanceMiles;
}

/**
 * Helper function to do ajax request of data
 * On success do the success callback otherwise do the failure callback
 * 
 * Success callback is passed a single parameter holding the request object
 * Failure callback not passed any parameters
 */
function ajaxFetch(url, success, failure) {
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.send();
  
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        success(req);
      }
      else {
        failure();
      }
    }
  };

  return null;
}

/**
* Get the coordinates of the postcode by fetching relevant json file
* json file has the 1st letter part of the postcode
* eg. EC2M 5BB -> ec.json
* 
* Always returns null, action initiated by callback passed as parameter
*/
function getCoordinates(txt, callback) {
  // any letter 1 or 2 times at beginning of string
  var regex = /^[a-z]{1,2}/
  var prefix = txt.trim().toLowerCase().match(regex);

  if (!(prefix in postcodeData.validPrefix)) {
    postcodeData.coords = postcodeData.ERR_MSG;
    callback();
    return null;
  }

  var url = postcodeData.PATH_P + prefix + '.json';
  
  var onFailure = function() {
    postcodeData.coords = postcodeData.ERR_MSG;
    callback();
  }

  var onSuccess = function(req) {
    var postcodeLoc = req.response;
    var query = txt.trim().toUpperCase();

    if (!(query in postcodeLoc)) {
      onFailure();
      return null;
    }

    var coords = postcodeLoc[query];
    postcodeData.coords = new Coordinates(coords[0], coords[1]);
    callback();
  }

  ajaxFetch(url, onSuccess, onFailure);
  return null;
}

/**
 * Loads list of MOT stations
 * Then calculates distance from postcode. 
 * 
 * Always returns null, action initiated by callback passed as parameter
 */
function getMotStations(coords, callback) {
  var url = postcodeData.PATH_MOT;

  var onFailure = function() {
    postcodeData.stations = postcodeData.ERR_LOAD;
    callback();
  }

  var onSuccess = function(req) {
    var stations = req.response;
    var length = stations.length;
    // get distance info
    for (var i=0; i < length; i++) {
      let s = stations[i];
      let stationCoords = new Coordinates(s.Easting, s.Northing);
      s.Distance = getDistance(postcodeData.coords, stationCoords);
    }

    // sort by distance
    var compareDist = function (stn1, stn2) {
      return stn1.Distance - stn2.Distance;
    };

    stations.sort(compareDist);
    postcodeData.stations = stations;
    callback();
  }

  ajaxFetch(url, onSuccess, onFailure);
  return null;
}

postcodeData.validPrefix = {
    "ab": 0,
    "al": 0,
    "b": 0,
    "ba": 0,
    "bb": 0,
    "bd": 0,
    "bh": 0,
    "bl": 0,
    "bn": 0,
    "br": 0,
    "bs": 0,
    "ca": 0,
    "cb": 0,
    "cf": 0,
    "ch": 0,
    "cm": 0,
    "co": 0,
    "cr": 0,
    "ct": 0,
    "cv": 0,
    "cw": 0,
    "da": 0,
    "dd": 0,
    "de": 0,
    "dg": 0,
    "dh": 0,
    "dl": 0,
    "dn": 0,
    "dt": 0,
    "dy": 0,
    "e": 0,
    "ec": 0,
    "eh": 0,
    "en": 0,
    "ex": 0,
    "fk": 0,
    "fy": 0,
    "g": 0,
    "gl": 0,
    "gu": 0,
    "ha": 0,
    "hd": 0,
    "hg": 0,
    "hp": 0,
    "hr": 0,
    "hs": 0,
    "hu": 0,
    "hx": 0,
    "ig": 0,
    "ip": 0,
    "iv": 0,
    "ka": 0,
    "kt": 0,
    "kw": 0,
    "ky": 0,
    "l": 0,
    "la": 0,
    "ld": 0,
    "le": 0,
    "ll": 0,
    "ln": 0,
    "ls": 0,
    "lu": 0,
    "m": 0,
    "me": 0,
    "mk": 0,
    "ml": 0,
    "n": 0,
    "ne": 0,
    "ng": 0,
    "nn": 0,
    "np": 0,
    "nr": 0,
    "nw": 0,
    "ol": 0,
    "ox": 0,
    "pa": 0,
    "pe": 0,
    "ph": 0,
    "pl": 0,
    "po": 0,
    "pr": 0,
    "rg": 0,
    "rh": 0,
    "rm": 0,
    "s": 0,
    "sa": 0,
    "se": 0,
    "sg": 0,
    "sk": 0,
    "sl": 0,
    "sm": 0,
    "sn": 0,
    "so": 0,
    "sp": 0,
    "sr": 0,
    "ss": 0,
    "st": 0,
    "sw": 0,
    "sy": 0,
    "ta": 0,
    "td": 0,
    "tf": 0,
    "tn": 0,
    "tq": 0,
    "tr": 0,
    "ts": 0,
    "tw": 0,
    "ub": 0,
    "w": 0,
    "wa": 0,
    "wc": 0,
    "wd": 0,
    "wf": 0,
    "wn": 0,
    "wr": 0,
    "ws": 0,
    "wv": 0,
    "yo": 0,
    "ze": 0
};
