# HomeBridge Wifi Presence

Detect presence in the room via wifi. This plugin is using MAC address to detect is anyone in the room or not.

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
      "clients": ["MAC ADDRESS1"],
      "presenceFile": "/var/lib/misc/presence.wifi"
    }
  ],

  "platforms": [

  ]
}
```

`MAC ADDRESS1` is device wifi MAC for telling homebridge when this MAC is present, make the room occipied. It can have more than 1 MAC address.

`presenceFile` is path to list of MAC address, currently default is `/var/lib/misc/presence.wifi` same as in [presence.sh](presence.sh) script.

Run `presence.sh` file in router/access point to gathering devices MAC address from wifi interfaces.

## License

ISC
