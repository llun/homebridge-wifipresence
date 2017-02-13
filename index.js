const _ = require('lodash')
const fs = require('fs')
const co = require('co')

const DEFAULT_PRESENCE_PATH = '/var/lib/misc/presence.wifi'
let Service, Characteristic

class WifiPresenceAccessory {
  constructor (log, config) {
    this.log = log
    this.config = config
    this.name = config.name
    this.room = config.room
    this.presenceFile = config.presenceFile || DEFAULT_PRESENCE_PATH
    this.mac = config.mac

    this.service = new Service.OccupancySensor(this.name)
    this.service
      .getCharacteristic(Characteristic.OccupancyDetected)
      .on('get', callback => this.isOccupied(callback))

    fs.watch(this.presenceFile, { persistent: false }, (type, filename) => {
      if (type === 'change') {
        this.isOccupied()
      }
    })
  }

  isOccupied (callback = _.noop) {
    const { log, mac, service } = this
    const readPresenceFile = this.readPresenceFile.bind(this)
    co(function* () {
      const content = yield readPresenceFile()
      const allMACs = content.trim().split('\n')
      if (_.intersection(allMACs, mac).length > 0) {
        log('occupied')
        service.setCharacteristic(Characteristic.OccupancyDetected, 1)
        callback(null, 1)
      } else {
        log('not-occupied')
        service.setCharacteristic(Characteristic.OccupancyDetected, 0)
        callback(null, 0)
      }
    })
    .catch(error => callback(error, 0))
  }

  readPresenceFile () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.presenceFile, { encoding: 'utf8' }, (error, data) => {
        if (error) return reject(error)
        return resolve(data)
      })
    })
  }

  getServices () {
    return [this.service, this.getInformationService()]
  }

  getInformationService () {
    var informationService = new Service.AccessoryInformation()
    informationService
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'Wifi presence 1.0')
      .setCharacteristic(Characteristic.Model, '1.0.0')
      .setCharacteristic(Characteristic.SerialNumber, 'NUC6i3')
    return informationService
  }

  identify (callback) {
    this.log('Identify request')
    callback()
  }
}

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory(
    'homebridge-wifi-presence',
    'WifiPresence',
    WifiPresenceAccessory
  )
}
