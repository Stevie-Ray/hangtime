export default {
  communityWorkouts: null,
  workouts: null,
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
    leftHand: 0,
    level: 0,
    left: 0,
    right: 0,
    rightHand: 0,
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
      description:
        'This is the fundamental exercise for developing contact strength. You should master the dead hang on any particular hold before attempting any other exercise on that hold. Never lock you elbows completely. Always keep a slight bend to prevent injury. Offset: Begin as with the bent arm hang. Shift your weight all the way to one side and hold a contraction. Shift your weight laterally, all the way to the other side, without lowering your body and hold an equal contraction.'
    },
    {
      name: 'Lock off - 45°',
      short: '45°',
      id: 1,
      background: 'rgba(54, 109, 115, 0.2)',
      border: 'rgba(54, 109, 115, 0.5)',

      image: 'exercises/bentarmhang.svg',
      description:
        'A variation of the dead hang which will begin to develop your ability to pull through and lock-off. This can be done at any angle, and should be varied as much as possible. Pull yourself up to the designated angle and hold a static contraction for the designated amount of time. Be careful of doing maximal contractions at full lock-off, as they can be as injurious as fully locked-out elbows.'
    },
    {
      name: 'Lock off - 90°',
      short: '90°',
      id: 2,
      background: 'rgba(90, 140, 140, 0.2)',
      border: 'rgba(90, 140, 140, 0.5)',
      image: 'exercises/lhang.svg',
      description:
        "The emphasis here is on core strength. Choose a hold that you're fairly comfortable on. You can dead hang or bent arm hang. Pull your legs up from the hips, keeping your knees straight and your toes pointed. Hold a static contraction with your legs at 90 degrees to your torso or do slow repetitions raising your legs as far as you can but only lowering to about 45 below horizontal. If you lower you legs all the way, it will take the tension off your abs and constitute a rest. The idea is to keep your abdominal muscles contracted the entire time. If straight leg raises are too difficult, bend your knees at a 90 degree angle."
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
      description:
        'Work up to these by performing them first with both legs bent at the knees, and then with one leg straight and one bent. If you can do a good front lever, try it with one arm.'
    }
  ],
  exercises: [
    {
      name: 'Pull-up',
      description: 'Pull-up',
      id: 1,
      type: 'arms'
    },
    {
      name: 'Scrap Pull',
      description: 'Scrap Pull',
      id: 2,
      type: 'arms'
    },
    {
      name: 'Negative Pull',
      description: 'Negative Pull',
      id: 3,
      type: 'arms'
    },
    {
      name: 'Typewriter',
      description: 'Typewriter',
      id: 4,
      type: 'arms'
    },
    {
      name: 'L-Hang',
      description: 'L-Hang',
      id: 5,
      type: 'legs'
    },
    {
      name: 'Knee raise',
      description: 'Knee raise',
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
