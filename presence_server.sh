#!/bin/bash
/usr/sbin/arp | /bin/grep ":" | /usr/bin/awk '{ print $3 }' > /var/lib/misc/presence.wifi
