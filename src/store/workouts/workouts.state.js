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
      image: 'exercises/deadhang.svg',
      description: 'Arms are fully extended'
    },
    {
      name: 'Lock off - 45°',
      short: '45°',
      id: 1,
      image: 'exercises/bentarmhang.svg',
      description: 'Arms in a 45° bent position'
    },
    {
      name: 'Lock off - 90°',
      short: '90°',
      id: 2,
      image: 'exercises/lhang.svg',
      description: 'Arms in a 90° bent position'
    },
    {
      name: 'Lock off - Full',
      short: 'Full',
      id: 3,
      image: 'exercises/pullup.svg',
      description: 'Arms in a full bent position',
      disabledExercises: [1, 2, 4]
    },
    {
      name: 'Front Lever',
      short: 'Front Lever',
      id: 4,
      image: 'exercises/frontlever.svg',
      description: 'Body completely horizontal, facing upwards'
    },
    {
      name: 'No Hang',
      short: 'No Hang',
      id: 5,
      image: 'exercises/nohang.svg',
      description: 'Feet on the ground, pull with your fingers',
      disabledExercises: [1, 2, 3, 4, 5, 6]
    }
  ],
  exercises: [
    {
      name: 'Pull-up',
      description: 'Pull yourself up towards the hangboard',
      id: 1,
      type: 'arms'
    },
    {
      name: 'Scrap Pull',
      description: 'Pull up with shoulders only, without bending arms',
      id: 2,
      type: 'arms'
    },
    {
      name: 'Negative Pull',
      description: 'Downward section of a Pull-up',
      id: 3,
      type: 'arms'
    },
    {
      name: 'Typewriter',
      description: 'Full lock off, go from side to side',
      id: 4,
      type: 'arms'
    },
    {
      name: 'L-Hang',
      description: 'Legs are in a 90° bent position',
      id: 5,
      type: 'legs'
    },
    {
      name: 'Knee raise',
      description: 'Raise your knee upwards ',
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
