export type Sleep = {
  id: number
  sleeps: {
    start: Date
    end: Date
  }[]
}

export type Prediction = {
  start: Date
  end: Date
}
