# HomeBridge Wifi Presence

Detect presence in the room via WiFi. This plugin uses MAC addresses to detect when somebody is in a room or not, depending on which network they are connected to.

## Setup

Install plugin `npm install -g homebridge-wifipresence` and add accessories to homebridge config.

```json
{
  "bridge": {
    "name": "Homebridge",
    "username": "CD:22:3D:E3:CE:30",
    "port": 51826,
    "pin": "031-45-154"
  },

  "description": "This is an example configuration for the WifiPresence homebridge plugin",

  "accessories": [
    {
      "accessory": "WifiPresence",
      "name": "Main Wifi",
      "room": "Living room",
      "clients": ["MAC ADDRESS1", "MAC ADDRESS2", ..., "MAC ADDRESSX"],
      "presenceFile": "/var/lib/misc/presence.wifi"
    }
  ],

  "platforms": [

  ]
}
```

`MAC ADDRESSX` is the device WiFi MAC Address that you want to monitor. Once this MAC Address is connected to your network, Homebridge will then trigger the presence sensor to make the room occupied. You can add more than 1 MAC address, and they should be written in lower case (i.e.: `aa:bb:cc:dd:ee:ff`).

`presenceFile` is the path to list of MAC addresses. Currently, the default path is `/var/lib/misc/presence.wifi`, the same as in [presence.sh](presence.sh) scripts.

### Presence scripts
Two presence scripts are provided:

- `presence.sh`: To run on the router/access point to gather device MAC addresses from WiFi interfaces.
- `presence.sh`: To run on the server where Homebridge is running, for when you do not have access or cannot run scripts on the router/access point.

## License

ISC
