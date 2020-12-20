export default {
  communityWorkouts: null,
  workouts: null,
  leaderboard: null,
  subscribers: [],
  workoutToCreate: {
    exercises: [],
    level: 2,
    share: false,
    video: ''
  },
  workoutDeletionPending: [],
  workoutCreationPending: false,
  exerciseToCreate: {
    exercise: 0,
    grip: 0,
    level: 0,
    left: 0,
    right: 0,
    pause: 10,
    hold: 10,
    pullups: 1,
    repeat: 0,
    rest: 0,
    time: 20,
    weight: 0,
    notes: ''
  },
  levels: [
    { name: 'easy', value: 1 },
    { name: 'normal', value: 2 },
    { name: 'hard', value: 3 }
  ],
  exerciseDeletionPending: [],
  exerciseCreationPending: false,
  grip: [
    {
      name: 'Dead Hang',
      short: 'Dead Hang',
      id: 0,
      background: 'rgba(1, 46, 64, 0.2)',
      border: 'rgba(1, 46, 64, 0.5)',
      image: 'exercises/deadhang.svg',
      description: '...'
    },
    {
      name: 'Lock off - 45°',
      short: '45°',
      id: 1,
      background: 'rgba(54, 109, 115, 0.2)',
      border: 'rgba(54, 109, 115, 0.5)',

      image: 'exercises/bentarmhang.svg',
      description: '...'
    },
    {
      name: 'Lock off - 90°',
      short: '90°',
      id: 2,
      background: 'rgba(90, 140, 140, 0.2)',
      border: 'rgba(90, 140, 140, 0.5)',
      image: 'exercises/lhang.svg',
      description: '...'
    },
    {
      name: 'Lock off - Full',
      short: 'Full',
      id: 3,
      background: 'rgba(188, 191, 164, 0.2)',
      borderColor: 'rgba(188, 191, 164, 0.5)',
      image: 'exercises/pullup.svg',
      description: '...',
      disabledExercises: [1, 2, 4]
    },
    {
      name: 'Front Lever',
      short: 'Front Lever',
      id: 4,
      background: 'rgba(188, 191, 164, 0.2)',
      borderColor: 'rgba(188, 191, 164, 0.5)',
      image: 'exercises/frontlever.svg',
      description: '...'
    }
  ],
  exercises: [
    {
      name: 'Pull-up',
      description: '...',
      id: 1,
      type: 'arms'
    },
    {
      name: 'Scrap Pull',
      description: '...',
      id: 2,
      type: 'arms'
    },
    {
      name: 'Negative Pull',
      description: '...',
      id: 3,
      type: 'arms'
    },
    {
      name: 'Typewriter',
      description: '...',
      id: 4,
      type: 'arms'
    },
    {
      name: 'L-Hang',
      description: '...',
      id: 5,
      type: 'legs'
    },
    {
      name: 'Knee raise',
      description: '...',
      id: 6,
      type: 'legs'
    }
  ],
  workoutFilter: {
    filter: 'Last Modified',
    value: ['updateTimestamp', 'createTimestamp']
  },
  sortOrder: 'desc'
}
