# UCL Room Bookings

This script crawls room bookings on [UCL Estates](https://roombooking.ucl.ac.uk/rb/bookableSpace/viewAllBookableSpace.html?invoker=EFD) and returns them in JSON format. Yep, that's all it does for now.

The most obvious idea is to use this to make a better room search site, but a more important & growing problem to tackle is the **lack of available rooms** around campus. Rooms are often booked, but then left unused. This could be for several reasons:

- Rooms get booked weeks in advance, which means people might make guesses about when they'll need a room, which they then forget to cancel when it ends up unused.

- People might book more rooms than they need in order to have some flexibility choosing a date/time for their event, but then they do not cancel the unused rooms.

I know of cases where the above has happened, and it could be happening all the time. From all the data on UCL Estates' website, it might just be possible to find people who are potentially "gaming" the system.
