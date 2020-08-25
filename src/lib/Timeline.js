'use strict'
export default class Timeline {
  /**
     *
     * @param {string} name
     * @param {int} id
     */
  constructor (name, id) {
    this.name = name
    this.id = id
    this.dailyMedia = []
  }

  get path () {
    return `timeline_${this.id}.json`
  }

  get [Symbol.toStringTag] () {
    return 'Timeline'
  }
}
