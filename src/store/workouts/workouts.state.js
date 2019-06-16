export default {
  workouts: null,
  workoutToCreate: '',
  workoutDeletionPending: [],
  workoutCreationPending: false,
  exerciseToCreate: {
    exercise: 0,
    left: 0,
    right: 0,
    pause: 10,
    hold: 10,
    repeat: 1,
    rest: 0
  },
  exerciseDeletionPending: [],
  exerciseCreationPending: false,
  options: [
    {
      name: 'Dead Hang',
      id: 0,
      image: 'exercises/deadhang.jpg'
    },
    {
      name: 'Bent Arm Hang',
      id: 1,
      image: 'exercises/bentarmhang.jpg'
    },
    {
      name: 'Offset Hang',
      id: 2,
      image: 'exercises/offsethang.jpg'
    },
    {
      name: 'Pull-up',
      id: 3,
      configurable: true,
      image: 'exercises/pullup.jpg'
    },
    {
      name: 'Offset Pull-up',
      id: 4,
      configurable: true,
      image: 'exercises/offsetpullup.jpg'
    },
    {
      name: 'One-arm Pull-up',
      id: 5,
      configurable: true,
      image: 'exercises/onearmpullup.jpg'
    },
    {
      name: 'L-Hang',
      id: 6,
      image: 'exercises/lhang.jpg'
    },
    {
      name: 'L-Hang Pull-up',
      id: 7,
      configurable: true,
      image: 'exercises/lhang.jpg'
    },
    {
      name: 'Front Lever',
      id: 8,
      image: 'exercises/frontlever.jpg'
    },
    {
      name: 'Front Lever Pull-up',
      id: 9,
      configurable: true,
      image: 'exercises/frontlever.jpg'
    }
  ]
}
