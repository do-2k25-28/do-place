# Database

This project uses Redis a its main and only database.

It includes 3 key (types)
- `canvas:main` - The canvas
- `cooldown:{userId}` - Cooldown for users
- `account:{userId}` - User accounts (userId, accountType, email, password, ...)
  - `account:by-username:{username}` - Map username to userId (DIY index)

## The canvas

The canvas storing mechanism is designed to work up to 16 different colors.

A pixel is half a byte. So the total size is `(width / 2) * height` bytes.

To access the pixel at x y, request the byte at x/

ex: 2 pixels in the same byte, first has color 4 second has color 13

4 is `0b0100` and 13 is `0b1101`

Byte in db should be `0b01001101`