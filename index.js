const _ = require('lodash')
const fs = require('fs')
const co = require('co')

const DEFAULT_PRESENCE_PATH = '/var/lib/misc/presence.wifi'
let Service, Characteristic

const OCCUPIED = 1
const NON_OCCUPIED = 0

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
    this.currentStatus = -1

    fs.watch(this.presenceFile, { persistent: false }, (type, filename) => {
      if (type === 'change') {
        this.isOccupied()
      }
    })
  }

  isOccupied (callback = _.noop) {
    const accessory = this
    co(function* () {
      const content = yield accessory.readPresenceFile()
      const allMACs = content.trim().split('\n')
      const status = _.intersection(allMACs, accessory.mac).length > 0 ? OCCUPIED : NON_OCCUPIED
      accessory.log(`Occupied statue: ${status}`)

      if (accessory.currentStatus !== status) {
        accessory.service.setCharacteristic(Characteristic.OccupancyDetected, OCCUPIED)
        accessory.currentStatus = OCCUPIED
      }

      callback(null, accessory.currentStatus)
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
