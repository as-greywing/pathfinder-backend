interface RouteQuery {
  res: Number;
  suez: Number;
  panama: Number;
  nonIRTC: Number;
  opos: String;
  dpos: String;
}

interface NetworkParams {
  res: 5 | 10 | 20 | 50
}

export { RouteQuery, NetworkParams };
