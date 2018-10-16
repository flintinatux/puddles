// fullPath :: () -> String
const fullPath = () =>
  location.pathname + location.search

// locationHash :: () -> String
const locationHash = () =>
  location.hash || '#/'

module.exports = {
  fullPath,
  locationHash
}
