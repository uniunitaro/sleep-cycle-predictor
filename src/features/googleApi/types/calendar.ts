export type Calendar = {
  id: string
}

export type EventInsertInput = {
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  summary: string
}

export type Event = {
  id: string
}
