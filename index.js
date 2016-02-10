var request = require("request-promise");
var url = require("url");
var cheerio = require("cheerio");
var _ = require("lodash");
var moment = require("moment");

var $ = cheerio.load("");


/*
Given any element, it only extracts its text contents, removing leading & trailing
spaces, newlines and tabs, which frequenly appear for some reason.
*/
function extractText(elem) {
  return $(elem).text().replace(/[\r\n\t]/g,"").trim();
}

/*
Given a table element, it extracts table cell elements in rows:

    [
      [ <th>, <th>, <th> ],
      [ <td>, <td>, <td> ],
      [ ... ]
    ]
*/
function extractTableCells(tableElement) {
  return $(tableElement).find("tr")
    .toArray()
    .map(elem => {
      return $(elem).find("td, th")
        .toArray()
    });
}

var bookingsColumnNames = ["start", "finish", "description", "contact", "telephone"];
function extractBookingsFromTable(tableElement) {
  return extractTableCells(tableElement)
    .slice(1) // remove header row
    .map(cells => {
      // only keep the text from all cells, no other data needed.
      var cellData = cells.map(extractText);
      return _.zipObject(bookingsColumnNames, cellData);
    });
}

function parseBooking(dateString, booking) {
  booking.start  = moment(`${dateString} ${booking.start}`,  "dddd D MMMM YYYY HH:mm").toDate();
  booking.finish = moment(`${dateString} ${booking.finish}`, "dddd D MMMM YYYY HH:mm").toDate();
  return booking;
}

var roomsColumnNames = ["name", "size", "type", "diaryLink", "infoLink", "photoLink"];
function extractRoomsFromTable(tableElement) {
  return extractTableCells(tableElement)
    .slice(1) // remove header row
    .map(cells => _.zipObject(roomsColumnNames, cells))
    .map(extractRoom);
}

function extractRoom(room) {
  var roomLink = $(room.diaryLink).find("a").attr("href");
  var query = url.parse(roomLink, true).query;
  return {
    name: extractText(room.name),
    type: extractText(room.type),
    size: +extractText(room.size),
    room: query.room,
    building: query.building
  };
}


function getAllRooms() {
  return request("https://roombooking.ucl.ac.uk/rb/bookableSpace/viewAllBookableSpace.html")
    .then(body => cheerio.load(body))
    .then($ => extractRoomsFromTable($(".rooms")[0]))
}

function getBookingsForRoom(room, building, startDate, endDate) {
  if (endDate === undefined) {
    endDate = startDate;
  }
  return request({
    uri: `https://roombooking.ucl.ac.uk/rb/bookableSpace/roomDiary.html?room=${room}&building=${building}&invoker=EFD`,
    method: "POST",
    form: {
      dateSpecifier: "dateRange",
      startDate: startDate,
      endDate: endDate
    }
  }).then(body => cheerio.load(body))
    .then($ => {

      var dailyBookings = $(".room").toArray()
          .map(extractBookingsFromTable);

      var dates = $(".room").prev().toArray()
          .map(extractText);

      var bookingsWithDates = _.zipWith(dates, dailyBookings, function(date, bookings) {
        return {
          date: moment(date, "dddd D MMMM YYYY").toDate(),
          bookings: bookings.map(booking => parseBooking(date, booking))
        };
      });

      return {
        room: room,
        building: building,
        bookingsByDay: bookingsWithDates
      }
    });
}

function getBookingsForAllRooms(startDate, endDate) {
  if (endDate === undefined) {
    endDate = startDate;
  }
  return getAllRooms()
    .then(rooms => Promise.all(
      rooms.map(room => getBookingsForRoom(
        room.room, room.building, startDate, endDate
      ))
    ))
}

exports.getAllRooms = getAllRooms;
exports.getBookingsForRoom = getBookingsForRoom;
exports.getBookingsForAllRooms = getBookingsForAllRooms;
