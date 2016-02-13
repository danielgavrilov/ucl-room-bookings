# UCL Room Bookings

This script scrapes room bookings from [UCL Estates](https://roombooking.ucl.ac.uk/rb/bookableSpace/viewAllBookableSpace.html?invoker=EFD) and returns them in JSON format.

## Usage

Install package by running:

```
npm install danielgavrilov/ucl-room-bookings
```

Some examples:

```javascript

var scraper = require("ucl-room-bookings");

scraper.getAllRooms().then(console.log)

// Gets an array of all the rooms:
//
// > [ { name: 'Anatomy B15',
//     type: 'Classroom',
//     size: 45,
//     room: 'B15B',
//     building: '016' },
//   { name: 'Anatomy G04 Gavin de Beer LT',
//     type: 'Lecture Theatre',
//     size: 82,
//     room: 'G04',
//     building: '016' },
//     ...
//   ]

scraper.getBookingsForRoom("B15B", "016", "11/02/2016", "13/02/2016").then(console.log)

// Gets bookings for 11-13 Feb 2016 (inclusive) for Anatomy B15:
//
// > [ { date: Thu Feb 11 2016 00:00:00 GMT+0000 (GMT),
//        bookings:
//         [ { start: Thu Feb 11 2016 08:00:00 GMT+0000 (GMT),
//             finish: Thu Feb 11 2016 08:30:00 GMT+0000 (GMT),
//             description: 'Porters',
//             contact: 'Porters & Cleaning',
//             telephone: '-' },
//           { start: Thu Feb 11 2016 10:00:00 GMT+0000 (GMT),
//             finish: Thu Feb 11 2016 13:00:00 GMT+0000 (GMT),
//             description: 'BENVGBU1',
//             contact: 'Mr Giorgio Talocci (Lecturer)',
//             telephone: '-' },
//           ...
//         ]
//      { date: Fri Feb 12 2016 00:00:00 GMT+0000 (GMT),
//        bookings: [Array] },
//      { date: Sat Feb 13 2016 00:00:00 GMT+0000 (GMT),
//        bookings: [Array] } ]

scraper.getBookingsForAllRooms("11/02/2016").then(console.log)

// Gets bookings for 11 Feb 2016 for all rooms:
//
// > [ { room: 'B15B', building: '016', bookingsByDay: [ [Object] ] },
//   { room: 'G04', building: '016', bookingsByDay: [ [Object] ] },
//   { room: 'G29', building: '016', bookingsByDay: [ [Object] ] },
//   { room: '117', building: '090', bookingsByDay: [ [Object] ] },
//   { room: '501', building: '090', bookingsByDay: [ [Object] ] },
//   ...
//   ]

```

## Notes

The most obvious idea is to use this to make a better room search site, but a more important & growing problem to tackle is the **lack of available rooms** around campus. Rooms are often booked, but then left unused. This could be for several reasons:

- Rooms get booked weeks in advance, which means people might make guesses about when they'll need a room, which they then forget to cancel when it ends up unused.

- People might book more rooms than they need in order to have some flexibility choosing a date/time for their event, but then they do not cancel the unused rooms.

I know of cases where the above has happened, and it could be happening all the time. From all the data on UCL Estates' website, it might just be possible to find people who are potentially "gaming" the system.
