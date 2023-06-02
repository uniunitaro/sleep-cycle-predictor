import { getUnixTime } from 'date-fns'
import { SegmentedSleep, Sleep } from '@prisma/client'
import { tTest } from 'simple-statistics'
import * as predictWithLR from './predictWithLR'

const realSleeps: (Sleep & { segmentedSleeps: SegmentedSleep[] })[] = [
  {
    id: 19,
    createdAt: '2023-04-17T12:27:46.623Z',
    updatedAt: '2023-04-17T12:27:46.623Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-03-30T19:41:00.000Z',
    end: '2023-03-31T05:51:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 20,
    createdAt: '2023-04-17T12:28:03.515Z',
    updatedAt: '2023-04-17T12:28:03.515Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-03-31T23:59:00.000Z',
    end: '2023-04-01T08:38:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 21,
    createdAt: '2023-04-17T12:28:15.779Z',
    updatedAt: '2023-04-17T12:28:15.779Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-01T23:00:00.000Z',
    end: '2023-04-02T06:11:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 22,
    createdAt: '2023-04-17T12:28:33.140Z',
    updatedAt: '2023-04-17T12:28:33.140Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-03T00:43:00.000Z',
    end: '2023-04-03T12:10:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 23,
    createdAt: '2023-04-17T12:28:54.215Z',
    updatedAt: '2023-04-17T12:28:54.215Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-04T03:33:00.000Z',
    end: '2023-04-04T12:14:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 24,
    createdAt: '2023-04-17T12:29:08.987Z',
    updatedAt: '2023-04-17T12:29:08.987Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-05T05:14:00.000Z',
    end: '2023-04-05T16:04:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 25,
    createdAt: '2023-04-17T12:29:22.453Z',
    updatedAt: '2023-04-17T12:29:22.453Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-06T06:49:00.000Z',
    end: '2023-04-06T15:11:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 26,
    createdAt: '2023-04-17T12:29:51.960Z',
    updatedAt: '2023-04-17T12:29:51.960Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-07T07:57:00.000Z',
    end: '2023-04-07T16:57:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 27,
    createdAt: '2023-04-17T12:30:13.160Z',
    updatedAt: '2023-04-17T12:30:13.160Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-08T09:19:00.000Z',
    end: '2023-04-08T13:47:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 28,
    createdAt: '2023-04-17T12:30:28.638Z',
    updatedAt: '2023-04-17T12:30:28.638Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-09T07:45:00.000Z',
    end: '2023-04-09T20:44:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 29,
    createdAt: '2023-04-17T12:30:51.584Z',
    updatedAt: '2023-04-17T12:30:51.584Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-10T13:49:00.000Z',
    end: '2023-04-10T23:55:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 30,
    createdAt: '2023-04-17T12:31:10.175Z',
    updatedAt: '2023-04-17T12:31:10.175Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-11T16:27:00.000Z',
    end: '2023-04-11T23:39:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 31,
    createdAt: '2023-04-17T12:31:28.780Z',
    updatedAt: '2023-04-17T12:31:28.780Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-12T14:30:00.000Z',
    end: '2023-04-13T02:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 32,
    createdAt: '2023-04-17T12:31:41.570Z',
    updatedAt: '2023-04-17T12:31:41.570Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-13T20:35:00.000Z',
    end: '2023-04-14T02:01:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 33,
    createdAt: '2023-04-17T12:31:57.775Z',
    updatedAt: '2023-04-17T12:31:57.775Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-14T18:43:00.000Z',
    end: '2023-04-15T04:52:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 34,
    createdAt: '2023-04-17T12:32:23.937Z',
    updatedAt: '2023-04-17T12:32:23.937Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-15T21:58:00.000Z',
    end: '2023-04-16T06:05:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 36,
    createdAt: '2023-04-17T19:32:13.364Z',
    updatedAt: '2023-04-17T19:32:13.364Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-17T01:33:00.000Z',
    end: '2023-04-17T09:52:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 42,
    createdAt: '2023-04-19T14:57:54.077Z',
    updatedAt: '2023-04-19T14:57:54.077Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-18T00:36:00.000Z',
    end: '2023-04-18T10:11:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 43,
    createdAt: '2023-04-19T14:58:28.020Z',
    updatedAt: '2023-04-19T14:58:28.020Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-19T02:30:00.000Z',
    end: '2023-04-19T13:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 44,
    createdAt: '2023-04-20T16:20:00.099Z',
    updatedAt: '2023-04-20T16:20:00.099Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-20T08:00:00.000Z',
    end: '2023-04-20T16:00:18.062Z',
    segmentedSleeps: [],
  },
  {
    id: 46,
    createdAt: '2023-04-21T21:59:00.521Z',
    updatedAt: '2023-04-21T21:59:00.521Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-21T05:00:00.000Z',
    end: '2023-04-21T17:00:27.408Z',
    segmentedSleeps: [],
  },
  {
    id: 47,
    createdAt: '2023-04-24T02:33:12.338Z',
    updatedAt: '2023-04-24T02:33:12.338Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-22T10:45:00.000Z',
    end: '2023-04-22T23:45:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 48,
    createdAt: '2023-04-24T06:44:05.176Z',
    updatedAt: '2023-04-24T06:44:05.176Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-23T08:30:00.000Z',
    end: '2023-04-23T19:00:33.442Z',
    segmentedSleeps: [],
  },
  {
    id: 76,
    createdAt: '2023-05-02T07:30:27.745Z',
    updatedAt: '2023-05-02T07:30:27.745Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-24T11:30:00.000Z',
    end: '2023-04-24T21:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 77,
    createdAt: '2023-05-02T07:30:53.870Z',
    updatedAt: '2023-05-02T07:30:53.870Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-25T14:16:00.000Z',
    end: '2023-04-25T23:11:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 78,
    createdAt: '2023-05-02T07:31:17.746Z',
    updatedAt: '2023-05-02T07:31:17.746Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-26T14:00:00.000Z',
    end: '2023-04-27T00:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 79,
    createdAt: '2023-05-02T07:31:54.799Z',
    updatedAt: '2023-05-02T07:31:54.799Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-27T18:00:00.000Z',
    end: '2023-04-28T02:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 80,
    createdAt: '2023-05-02T07:32:43.360Z',
    updatedAt: '2023-05-02T07:32:43.360Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-28T20:30:00.000Z',
    end: '2023-04-29T02:30:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 81,
    createdAt: '2023-05-02T07:33:37.828Z',
    updatedAt: '2023-05-02T07:33:37.828Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-29T22:30:00.000Z',
    end: '2023-04-30T07:10:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 82,
    createdAt: '2023-05-02T07:34:13.542Z',
    updatedAt: '2023-05-02T07:34:13.542Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-04-30T22:00:00.000Z',
    end: '2023-05-01T07:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 83,
    createdAt: '2023-05-02T07:34:42.319Z',
    updatedAt: '2023-05-02T07:34:42.319Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-01T22:04:00.000Z',
    end: '2023-05-02T07:26:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 84,
    createdAt: '2023-05-03T09:23:35.881Z',
    updatedAt: '2023-05-03T09:23:35.881Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-02T23:30:21.070Z',
    end: '2023-05-03T09:20:21.070Z',
    segmentedSleeps: [],
  },
  {
    id: 85,
    createdAt: '2023-05-04T10:02:43.748Z',
    updatedAt: '2023-05-04T10:02:43.748Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-03T23:15:28.420Z',
    end: '2023-05-04T10:00:28.420Z',
    segmentedSleeps: [],
  },
  {
    id: 86,
    createdAt: '2023-05-05T14:55:55.834Z',
    updatedAt: '2023-05-05T14:55:55.834Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-05T03:30:35.191Z',
    end: '2023-05-05T14:30:35.191Z',
    segmentedSleeps: [],
  },
  {
    id: 90,
    createdAt: '2023-05-06T15:18:58.037Z',
    updatedAt: '2023-05-06T15:18:58.037Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-06T05:50:00.000Z',
    end: '2023-05-06T14:50:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 91,
    createdAt: '2023-05-07T21:45:02.541Z',
    updatedAt: '2023-05-07T21:45:02.541Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-07T06:30:00.000Z',
    end: '2023-05-07T12:30:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 92,
    createdAt: '2023-05-09T03:36:41.299Z',
    updatedAt: '2023-05-09T03:36:41.299Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-08T04:30:00.000Z',
    end: '2023-05-08T20:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 94,
    createdAt: '2023-05-09T21:55:31.320Z',
    updatedAt: '2023-05-09T21:55:31.320Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-09T08:30:00.000Z',
    end: '2023-05-09T21:30:18.975Z',
    segmentedSleeps: [],
  },
  {
    id: 95,
    createdAt: '2023-05-10T21:56:33.246Z',
    updatedAt: '2023-05-10T21:56:33.246Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-10T11:00:00.000Z',
    end: '2023-05-10T19:30:10.373Z',
    segmentedSleeps: [],
  },
  {
    id: 96,
    createdAt: '2023-05-11T21:34:56.180Z',
    updatedAt: '2023-05-11T21:34:56.180Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-11T10:30:00.000Z',
    end: '2023-05-11T20:30:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 97,
    createdAt: '2023-05-13T00:01:49.552Z',
    updatedAt: '2023-05-13T00:01:49.552Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-12T13:30:00.000Z',
    end: '2023-05-13T00:00:10.761Z',
    segmentedSleeps: [],
  },
  {
    id: 98,
    createdAt: '2023-05-14T01:14:03.727Z',
    updatedAt: '2023-05-14T01:14:03.727Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-13T17:00:43.282Z',
    end: '2023-05-14T01:00:43.282Z',
    segmentedSleeps: [],
  },
  {
    id: 100,
    createdAt: '2023-05-15T11:34:24.410Z',
    updatedAt: '2023-05-15T11:34:24.410Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-14T18:00:00.000Z',
    end: '2023-05-15T05:40:58.219Z',
    segmentedSleeps: [],
  },
  {
    id: 101,
    createdAt: '2023-05-16T05:59:43.731Z',
    updatedAt: '2023-05-16T05:59:43.731Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-15T21:30:30.772Z',
    end: '2023-05-16T05:40:30.772Z',
    segmentedSleeps: [],
  },
  {
    id: 102,
    createdAt: '2023-05-17T08:35:08.734Z',
    updatedAt: '2023-05-17T08:35:08.734Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-16T22:20:00.000Z',
    end: '2023-05-17T08:00:53.288Z',
    segmentedSleeps: [],
  },
  {
    id: 103,
    createdAt: '2023-05-18T13:44:10.912Z',
    updatedAt: '2023-05-18T13:44:10.912Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-17T22:00:56.577Z',
    end: '2023-05-18T05:30:56.577Z',
    segmentedSleeps: [],
  },
  {
    id: 104,
    createdAt: '2023-05-19T10:48:25.372Z',
    updatedAt: '2023-05-19T10:48:25.372Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-18T23:00:07.038Z',
    end: '2023-05-19T10:30:07.038Z',
    segmentedSleeps: [],
  },
  {
    id: 105,
    createdAt: '2023-05-20T17:38:47.352Z',
    updatedAt: '2023-05-20T17:38:47.352Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-20T03:00:00.000Z',
    end: '2023-05-20T11:00:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 106,
    createdAt: '2023-05-21T19:15:07.569Z',
    updatedAt: '2023-05-21T19:15:07.569Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-21T02:30:00.000Z',
    end: '2023-05-21T11:30:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 107,
    createdAt: '2023-05-22T21:33:07.012Z',
    updatedAt: '2023-05-22T21:33:07.012Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-22T06:00:00.000Z',
    end: '2023-05-22T16:30:31.887Z',
    segmentedSleeps: [],
  },
  {
    id: 108,
    createdAt: '2023-05-23T18:00:31.325Z',
    updatedAt: '2023-05-23T18:00:31.325Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-23T06:00:00.000Z',
    end: '2023-05-23T17:45:55.976Z',
    segmentedSleeps: [],
  },
  {
    id: 109,
    createdAt: '2023-05-24T18:53:10.650Z',
    updatedAt: '2023-05-24T18:53:10.650Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-24T11:30:00.000Z',
    end: '2023-05-24T18:45:23.180Z',
    segmentedSleeps: [],
  },
  {
    id: 110,
    createdAt: '2023-05-25T22:20:07.779Z',
    updatedAt: '2023-05-25T22:20:07.779Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-25T06:00:00.000Z',
    end: '2023-05-25T19:30:41.693Z',
    segmentedSleeps: [],
  },
  {
    id: 111,
    createdAt: '2023-05-27T03:46:27.304Z',
    updatedAt: '2023-05-27T03:46:27.304Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-26T16:30:00.000Z',
    end: '2023-05-26T21:30:08.432Z',
    segmentedSleeps: [],
  },
  {
    id: 112,
    createdAt: '2023-05-28T02:05:53.309Z',
    updatedAt: '2023-05-28T02:05:53.309Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-27T16:00:43.761Z',
    end: '2023-05-28T00:40:43.761Z',
    segmentedSleeps: [],
  },
  {
    id: 113,
    createdAt: '2023-05-29T02:28:29.284Z',
    updatedAt: '2023-05-29T02:28:29.284Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-28T15:40:56.375Z',
    end: '2023-05-29T01:40:00.000Z',
    segmentedSleeps: [],
  },
  {
    id: 125,
    createdAt: '2023-05-30T07:33:44.656Z',
    updatedAt: '2023-05-30T07:33:44.656Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-29T20:00:26.866Z',
    end: '2023-05-30T07:30:26.866Z',
    segmentedSleeps: [],
  },
  {
    id: 126,
    createdAt: '2023-05-31T05:20:19.839Z',
    updatedAt: '2023-05-31T05:20:19.839Z',
    userId: 'QxURPkM1WvVwiytseiF2WbP8GZc2',
    start: '2023-05-30T23:00:03.825Z',
    end: '2023-05-31T04:00:03.825Z',
    segmentedSleeps: [],
  },
].map((sleep) => ({
  ...sleep,
  start: new Date(sleep.start),
  end: new Date(sleep.end),
  createdAt: new Date(sleep.createdAt),
  updatedAt: new Date(sleep.updatedAt),
}))

describe('getOutlierSleeps', () => {
  const combinedSleeps = realSleeps.map((sleep) => ({
    sleep,
    duration: 8,
    sleepMidUnixTime:
      getUnixTime(sleep.start) +
      (getUnixTime(sleep.end) - getUnixTime(sleep.start)) / 2,
  }))

  test('外れ値がないときは空配列が返される', () => {
    const result = predictWithLR.getOutlierSleeps(combinedSleeps)
    expect(result).toEqual([])
  })

  test('外れ値があるときはそのSleepのidが返される', () => {
    const combinedSleepsWithOutlier = combinedSleeps.filter(
      (sleep) => sleep.sleep.id !== 96,
    )
    const result = predictWithLR.getOutlierSleeps(combinedSleepsWithOutlier)
    // 96の次の97が外れ値になる
    expect(result).toEqual([{ id: 97, interpolationDays: 1 }])
  })

  test('interpolationDaysが適切に計算される', () => {
    const combinedSleepsWithOutlier = combinedSleeps.filter(
      (sleep) => sleep.sleep.id !== 96 && sleep.sleep.id !== 97,
    )

    const result = predictWithLR.getOutlierSleeps(combinedSleepsWithOutlier)
    // 97の次の98が外れ値になる
    expect(result).toEqual([{ id: 98, interpolationDays: 2 }])
  })

  test('睡眠が1つ以下のときは空配列が返される', () => {
    const result = predictWithLR.getOutlierSleeps([])
    expect(result).toEqual([])

    const result2 = predictWithLR.getOutlierSleeps([combinedSleeps[0]])
    expect(result2).toEqual([])
  })

  test('睡眠の要素数が少ないときも外れ値が出ない', () => {
    const result = predictWithLR.getOutlierSleeps([
      combinedSleeps[0],
      combinedSleeps[1],
    ])
    expect(result).toEqual([])

    const result2 = predictWithLR.getOutlierSleeps([
      combinedSleeps[0],
      combinedSleeps[1],
      combinedSleeps[2],
    ])
    expect(result2).toEqual([])

    const result3 = predictWithLR.getOutlierSleeps([
      combinedSleeps[0],
      combinedSleeps[1],
      combinedSleeps[2],
      combinedSleeps[3],
    ])
    expect(result3).toEqual([])
  })
})

const sleepTestCases: (Sleep & { segmentedSleeps: SegmentedSleep[] })[] = [
  {
    id: 1,
    start: new Date('2022-01-01T00:00:00.000Z'),
    end: new Date('2022-01-01T08:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 2,
    start: new Date('2022-01-02T01:00:00.000Z'),
    end: new Date('2022-01-02T09:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 3,
    start: new Date('2022-01-03T02:00:00.000Z'),
    end: new Date('2022-01-03T10:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 4,
    start: new Date('2022-01-04T03:00:00.000Z'),
    end: new Date('2022-01-04T11:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 5,
    start: new Date('2022-01-05T04:00:00.000Z'),
    end: new Date('2022-01-05T12:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 6,
    start: new Date('2022-01-06T05:00:00.000Z'),
    end: new Date('2022-01-06T13:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
  {
    id: 7,
    start: new Date('2022-01-07T06:00:00.000Z'),
    end: new Date('2022-01-07T14:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
  },
]

describe('predictWithLR', () => {
  beforeEach(() => {
    // import * as の形式で読み込んだやつは毎回モックをリセットしないといけないらしい
    jest.resetAllMocks()
  })

  test('指定した期間における予測された睡眠の配列が返される', () => {
    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR.predictWithLR(
      sleepTestCases,
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z'),
    )
    expect(result).toEqual(expected)

    const expected2 = [
      {
        start: new Date('2022-01-09T08:00:00.000Z'),
        end: new Date('2022-01-09T16:00:00.000Z'),
      },
    ]
    const result2 = predictWithLR.predictWithLR(
      sleepTestCases,
      new Date('2022-01-09T00:00:00.000Z'),
      new Date('2022-01-10T00:00:00.000Z'),
    )
    expect(result2).toEqual(expected2)
  })

  test('睡眠が1つ以下のときは空配列が返される', () => {
    const result = predictWithLR.predictWithLR(
      [],
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z'),
    )
    expect(result).toEqual([])

    const result2 = predictWithLR.predictWithLR(
      [sleepTestCases[0]],
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z'),
    )
    expect(result2).toEqual([])
  })

  test('startよりも後に睡眠が存在するときは、その睡眠の次の予測から返される', () => {
    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR.predictWithLR(
      sleepTestCases,
      new Date('2022-01-07T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z'),
    )
    expect(result).toEqual(expected)
  })

  test('SegmentedSleepがあるときは結合されて予測される', () => {
    const sleepWithSegmentedSleeps: (Sleep & {
      segmentedSleeps: SegmentedSleep[]
    })[] = sleepTestCases.map((sleep) =>
      sleep.id === 4
        ? {
            ...sleep,
            start: new Date('2022-01-04T03:00:00.000Z'),
            end: new Date('2022-01-04T05:00:00.000Z'),
            segmentedSleeps: [
              {
                id: 1,
                start: new Date('2022-01-04T09:00:00.000Z'),
                end: new Date('2022-01-04T11:00:00.000Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
                sleepId: 4,
              },
            ],
          }
        : sleep,
    )

    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR.predictWithLR(
      sleepWithSegmentedSleeps,
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z'),
    )

    expect(result).toEqual(expected)
  })

  describe('外れ値があるときは外れ値が補完されて予測される', () => {
    test('外れ値が1つのとき', () => {
      const sleepWithOutlier = sleepTestCases.filter((sleep) => sleep.id !== 3)

      const expected = predictWithLR.predictWithLR(
        sleepTestCases,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
      )

      jest
        .spyOn(predictWithLR, 'getOutlierSleeps')
        .mockReturnValue([{ id: 4, interpolationDays: 1 }])
      const result = predictWithLR.predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
      )
      expect(result).toEqual(expected)
    })

    test('外れ値が複数のとき', () => {
      const sleepWithOutlier = sleepTestCases.filter(
        (sleep) => sleep.id !== 2 && sleep.id !== 4 && sleep.id !== 5,
      )

      const expected = predictWithLR.predictWithLR(
        sleepTestCases,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
      )

      jest.spyOn(predictWithLR, 'getOutlierSleeps').mockReturnValue([
        { id: 3, interpolationDays: 1 },
        { id: 6, interpolationDays: 2 },
      ])
      const result = predictWithLR.predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
      )
      expect(result).toEqual(expected)
    })

    test('外れ値がある && startよりも後に睡眠が存在するとき、その睡眠の次の予測から返される', () => {
      const sleepWithOutlier = sleepTestCases.filter((sleep) => sleep.id !== 3)

      const expected = [
        {
          start: new Date('2022-01-08T07:00:00.000Z'),
          end: new Date('2022-01-08T15:00:00.000Z'),
        },
      ]
      const result = predictWithLR.predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-07T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
      )
      expect(result).toEqual(expected)
    })
  })
})
