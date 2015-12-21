var request = require("request-promise");
var url = require("url");
var cheerio = require("cheerio");
var _ = require("lodash");
var moment = require("moment");

var $ = cheerio.load("");

var roomsColumnNames = ["name", "size", "type", "diaryLink", "infoLink", "photoLink"];
var bookingsColumnNames = ["start", "finish", "description", "contact", "telephone"];

// var rooms = request("https://roombooking.ucl.ac.uk/rb/bookableSpace/viewAllBookableSpace.html")
//   .then(body => cheerio.load(body))
//   .then($ => {
//     return $(".rooms").find("tr")
//       .toArray()
//       .slice(1)
//       .map(elem => extractRowElems(roomsColumnNames, elem))
//       .map(extractRoom);
//   })
//   .then(console.log)

var bookings = request({
  uri: "https://roombooking.ucl.ac.uk/rb/bookableSpace/roomDiary.html?room=G29&building=016&invoker=EFD",
  method: "POST",
  form: {
    dateSpecifier: "dateRange",
    startDate: "21/12/2015",
    endDate: "31/12/2015"
  }
})
  .then(body => cheerio.load(body))
  .then($ => {

    var bookings = $(".room")
        .toArray()
        .map(extractBooking)

    var dates = $(".room").prev()
        .toArray()
        .map(extractText)

    return _.zipObject(dates, bookings);
  })
  .then(console.log)


var Booking = {

};

function getAllRooms() {}
function getAllBookings(start, end) {}

function getBookingsForRoom(room, start, end) {
  return [{
    day: Date,
    bookings: [Booking]
  }];
}

function extractRowElems(columnNames, elem) {
  var row = $(elem).find("td");
  return _.zipObject(columnNames, row);
}

function extractRoom(d) {
  var roomLink = $(d.diaryLink).find("a").attr("href");
  var query = url.parse(roomLink, true).query;
  return {
    name: $(d.name).text(),
    type: $(d.type).text(),
    size: +$(d.size).text(),
    room: query.room,
    building: query.building
  };
}

function extractBooking(date, d) {
  d.start = moment(`${date} ${d.start}`).toDate();
  d.finish = moment(`${date} ${d.finish}`).toDate();
  return d;
}

function extractText(elem) {
  return $(elem).text().replace(/[\r\n\t]/g,"").trim();
}
