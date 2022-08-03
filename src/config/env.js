const ws = {
  protocol: document.location.protocol === 'https:' ? `wss://${window.location.host}` : `ws://${window.location.host}`
}

export {
  ws
}
