// Implementation of globally shared state across all Views in application
// Uses ECMA 6 Class implementation

'use strict'
class State {
  constructor() {
    // recover old state or empty
    var old = localStorage.getItem('sar-state');
    this.state = old ? JSON.parse(old) : {};
    return
  }
  // Pull item with specified itemKey out of the local storage
  getItem(itemKey) {
    return this.state[itemKey];
  }

  // Set single item in local storage
  setItem(itemKey, itemValue) {
    this.state[itemKey] = itemValue;
    this.persistState();
    return
  }

  // Allow for setting mulitple values at a time in localStorage
  setItems(keyValueArray) {
    this.state = {...this.state, ...keyValueArray};
    this.persistState();
    return
  }

  removeItem(itemKey) {
    delete this.state[itemKey];
    localStorage.removeItem(itemKey)
    return
  }

  persistState() {
    localStorage.setItem('sar-state', JSON.stringify(this.state))
    return
  }
}