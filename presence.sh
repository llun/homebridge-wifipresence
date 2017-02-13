#!/bin/sh
while true
do
  all=""
  for interface in `iw dev | grep Interface | cut -f 2 -s -d" "`
  do
    # for each interface, get mac addresses of connected stations/clients
    maclist=`iw dev $interface station dump | grep Station | cut -f 2 -s -d" "`

    # for each mac address in that list...
    for mac in $maclist
    do
      all="$mac\n$all"
    done
  done
  echo $all > /var/lib/misc/presence.wifi
sleep 5
done
