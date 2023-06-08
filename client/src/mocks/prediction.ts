import { GetPredictionsResponse } from '@shared-types/predictions/predictions.type'

export const mockPrediction = (
  modification?: Partial<GetPredictionsResponse[number]>
): GetPredictionsResponse[number] => ({
  start: new Date(2023, 0, 2, 0),
  end: new Date(2023, 0, 2, 8),
  ...modification,
})
