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
    level: 0,
    left: 0,
    right: 0,
    pause: 10,
    hold: 10,
    pullups: 0,
    repeat: 1,
    rest: 0,
    time: 20
  },
  levels: [
    { name: 'easy', value: 1 },
    { name: 'normal', value: 2 },
    { name: 'hard', value: 3 }
  ],
  exerciseDeletionPending: [],
  exerciseCreationPending: false,
  options: [
    {
      name: 'Dead Hang',
      id: 0,
      background: 'rgba(1, 46, 64, 0.2)',
      border: 'rgba(1, 46, 64, 0.5)',
      image: 'exercises/deadhang.svg',
      description:
        'This is the fundamental exercise for developing contact strength. You should master the dead hang on any particular hold before attempting any other exercise on that hold. Never lock you elbows completely. Always keep a slight bend to prevent injury. Offset: Begin as with the bent arm hang. Shift your weight all the way to one side and hold a contraction. Shift your weight laterally, all the way to the other side, without lowering your body and hold an equal contraction.'
    },
    {
      name: 'Flexed Arm Hang',
      id: 1,
      background: 'rgba(54, 109, 115, 0.2)',
      border: 'rgba(54, 109, 115, 0.5)',

      image: 'exercises/bentarmhang.svg',
      description:
        'A variation of the dead hang which will begin to develop your ability to pull through and lock-off. This can be done at any angle, and should be varied as much as possible. Pull yourself up to the designated angle and hold a static contraction for the designated amount of time. Be careful of doing maximal contractions at full lock-off, as they can be as injurious as fully locked-out elbows.'
    },
    {
      name: 'L-Hang',
      id: 2,
      background: 'rgba(90, 140, 140, 0.2)',
      border: 'rgba(90, 140, 140, 0.5)',
      image: 'exercises/lhang.svg',
      description:
        "The emphasis here is on core strength. Choose a hold that you're fairly comfortable on. You can dead hang or bent arm hang. Pull your legs up from the hips, keeping your knees straight and your toes pointed. Hold a static contraction with your legs at 90 degrees to your torso or do slow repetitions raising your legs as far as you can but only lowering to about 45 below horizontal. If you lower you legs all the way, it will take the tension off your abs and constitute a rest. The idea is to keep your abdominal muscles contracted the entire time. If straight leg raises are too difficult, bend your knees at a 90 degree angle."
    },
    {
      name: 'Front Lever',
      id: 3,
      background: 'rgba(188, 191, 164, 0.2)',
      borderColor: 'rgba(188, 191, 164, 0.5)',
      image: 'exercises/frontlever.svg',
      description:
        'Work up to these by performing them first with both legs bent at the knees, and then with one leg straight and one bent. If you can do a good front lever, try it with one arm.'
    }
  ]
}
