export default {
  data: [
    // disable low grades
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 1,
    //   yds: '5.1',
    //   french: '1',
    //   british: null,
    //   tech: '2',
    //   ewbank: 4,
    //   brz: 'I sup',
    //   uiaa: 'I',
    //   uiaa_metric: '1.00',
    //   watts: null
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 2,
    //   yds: '5.2',
    //   french: '2',
    //   british: '3',
    //   tech: '2',
    //   ewbank: 6,
    //   brz: 'II',
    //   uiaa: 'II',
    //   uiaa_metric: '2.00',
    //   watts: null
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 3,
    //   yds: '5.3',
    //   french: '2+',
    //   british: '3',
    //   tech: ['2', '4'],
    //   ewbank: [6, 8],
    //   brz: 'II sup',
    //   uiaa: ['III', 'III+'],
    //   uiaa_metric: '3.00',
    //   watts: null
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 4,
    //   yds: '5.4',
    //   french: '3-',
    //   british: '3',
    //   tech: '4',
    //   ewbank: [8, 10],
    //   brz: 'III',
    //   uiaa: ['III+', 'IV'],
    //   uiaa_metric: ['3.50', '4.00'],
    //   watts: null
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 5,
    //   yds: '5.5',
    //   french: '3',
    //   british: '3',
    //   tech: '4',
    //   ewbank: [10, 12],
    //   brz: 'IV',
    //   uiaa: ['IV', 'IV+'],
    //   uiaa_metric: ['4.00', '4.33'],
    //   watts: null
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 6,
    //   yds: '5.6',
    //   french: '3+',
    //   british: ['3', '5a'],
    //   tech: '4',
    //   ewbank: 12,
    //   brz: ['IV', 'V'],
    //   uiaa: ['IV+', 'V-'],
    //   uiaa_metric: ['4.33', '4.66'],
    //   watts: '0.00'
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 7,
    //   yds: '5.7',
    //   french: '4',
    //   british: ['3', '5a'],
    //   tech: '4',
    //   ewbank: [12, 14],
    //   brz: ['V', 'V sup'],
    //   uiaa: ['V-', 'V'],
    //   uiaa_metric: ['4.66', '5.00'],
    //   watts: '0.25'
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: null,
    //   font: null,
    //   ircra: 8,
    //   yds: '5.8',
    //   french: '4+',
    //   british: '5a',
    //   tech: '4',
    //   ewbank: [14, 16],
    //   brz: ['V', 'V sup'],
    //   uiaa: ['V', 'V+'],
    //   uiaa_metric: ['5', '5.33'],
    //   watts: '0.50'
    // },
    //
    // {
    //   group: {
    //     male: 1,
    //     female: 1
    //   },
    //   vermin: 'VB',
    //   font: '<=2',
    //   ircra: 9,
    //   yds: '5.9',
    //   french: '5',
    //   british: '5a',
    //   tech: ['4', '5b'],
    //   ewbank: [16, 18],
    //   brz: ['V sup', 'VI'],
    //   uiaa: ['V+', 'VI-'],
    //   uiaa_metric: ['5.33', '5.66'],
    //   watts: '0.75'
    // },
    //
    // {
    //   group: {
    //     male: 2,
    //     female: 2
    //   },
    //   vermin: ['VB', 'V0-'],
    //   font: ['<=2', '3'],
    //   ircra: 10,
    //   yds: '5.10a',
    //   french: '5+',
    //   british: ['5a', '5c'],
    //   tech: ['4', '5b'],
    //   ewbank: 18,
    //   brz: ['V sup', 'VI'],
    //   uiaa: ['VI-', 'VI'],
    //   uiaa_metric: ['5.66', '6.00'],
    //   watts: '0.75'
    // },

    {
      group: {
        male: 2,
        female: 2
      },
      vermin: 'V0-',
      font: '3',
      ircra: 11,
      yds: '5.10b',
      french: '6a',
      british: '5c',
      tech: '5b',
      ewbank: [18, 19],
      brz: ['VI', 'VI sup'],
      uiaa: ['VI+', 'VII-'],
      uiaa_metric: '6.33',
      watts: '1.25'
    },

    {
      group: {
        male: 2,
        female: 2
      },
      vermin: 'V0',
      font: '4',
      ircra: 12,
      yds: '5.10c',
      french: '6a+',
      british: '5c',
      tech: ['5b', '6a'],
      ewbank: [19, 20],
      brz: ['VI', 'VI sup'],
      uiaa: ['VI+', 'VII-'],
      uiaa_metric: '6.66',
      watts: '1.50'
    },

    {
      group: {
        male: 2,
        female: 2
      },
      vermin: 'V0+',
      font: '4+',
      ircra: 13,
      yds: '5.10d',
      french: '6b',
      british: '5c',
      tech: '6a',
      ewbank: 20,
      brz: 'VI sup',
      uiaa: 'VII',
      uiaa_metric: '7.00',
      watts: '1.75'
    },

    {
      group: {
        male: 2,
        female: 2
      },
      vermin: 'V1',
      font: '5',
      ircra: 14,
      yds: '5.11a',
      french: '6b+',
      british: ['5c', '6b'],
      tech: '6a',
      ewbank: 21,
      brz: '7a',
      uiaa: ['VII', 'VII+'],
      uiaa_metric: ['7.00', '7.33'],
      watts: '2.00'
    },

    {
      group: {
        male: 2,
        female: 3
      },
      vermin: ['V1', 'V2'],
      font: '5+',
      ircra: 15,
      yds: '5.11b',
      french: '6c',
      british: '6b',
      tech: '6a',
      ewbank: [21, 22],
      brz: ['7a', '7b'],
      uiaa: ['VII+', 'VIII-'],
      uiaa_metric: '7.33',
      watts: '2.25'
    },

    {
      group: {
        male: 2,
        female: 3
      },
      vermin: 'V2',
      font: ['6A', '6A+'],
      ircra: 16,
      yds: '5.11c',
      french: '6c+',
      british: '6b',
      tech: '6a',
      ewbank: 22,
      brz: ['7b', '7c'],
      uiaa: 'VIII-',
      uiaa_metric: '7.66',
      watts: '2.50'
    },

    {
      group: {
        male: 2,
        female: 3
      },
      vermin: 'V3',
      font: '6B',
      ircra: 17,
      yds: '5.11d',
      french: '7a',
      british: '6b',
      tech: ['6a', '6c'],
      ewbank: 23,
      brz: ['7c', '8a'],
      uiaa: 'VIII',
      uiaa_metric: '8.00',
      watts: '2.75'
    },

    {
      group: {
        male: 3,
        female: 3
      },
      vermin: 'V4',
      font: '6B+',
      ircra: 18,
      yds: '5.12a',
      french: '7a+',
      british: '6b',
      tech: '6c',
      ewbank: 24,
      brz: '8a',
      uiaa: ['VIII', 'VIII+'],
      uiaa_metric: '8.33',
      watts: '3.00'
    },

    {
      group: {
        male: 3,
        female: 3
      },
      vermin: 'V5',
      font: ['6C', '6C+'],
      ircra: 19,
      yds: '5.12b',
      french: '7b',
      british: '6b',
      tech: '6c',
      ewbank: 25,
      brz: '8b',
      uiaa: ['VIII+', 'IX-'],
      uiaa_metric: ['8.33', '8.66'],
      watts: '3.25'
    },

    {
      group: {
        male: 3,
        female: 3
      },
      vermin: 'V6',
      font: '7A',
      ircra: 20,
      yds: '5.12c',
      french: '7b+',
      british: '6b',
      tech: '6c',
      ewbank: 26,
      brz: '8c',
      uiaa: ['IX-', 'IX'],
      uiaa_metric: ['8.66', '9.00'],
      watts: '3.50'
    },

    {
      group: {
        male: 3,
        female: 4
      },
      vermin: 'V7',
      font: '7A+',
      ircra: 21,
      yds: '5.12d',
      french: '7c',
      british: ['6b', '7a'],
      tech: '6c',
      ewbank: 27,
      brz: '9a',
      uiaa: ['IX', 'IX+'],
      uiaa_metric: ['9.00', '9.33'],
      watts: '3.75'
    },

    {
      group: {
        male: 3,
        female: 4
      },
      vermin: 'V8',
      font: '7B',
      ircra: 22,
      yds: '5.13a',
      french: '7c+',
      british: '7a',
      tech: '6c',
      ewbank: 28,
      brz: '9b',
      uiaa: 'IX+',
      uiaa_metric: '9.33',
      watts: '4.00'
    },

    {
      group: {
        male: 3,
        female: 4
      },
      vermin: ['V8', 'V9'],
      font: '7B+',
      ircra: 23,
      yds: '5.13b',
      french: '8a',
      british: '7a',
      tech: '6c',
      ewbank: 29,
      brz: '9c',
      uiaa: 'X-',
      uiaa_metric: '9.66',
      watts: '4.25'
    },

    {
      group: {
        male: 4,
        female: 4
      },
      vermin: ['V9', 'V10'],
      font: '7C',
      ircra: 24,
      yds: '5.13c',
      french: '8a+',
      british: '7a',
      tech: '6c',
      ewbank: 30,
      brz: '10a',
      uiaa: ['X-', 'X'],
      uiaa_metric: ['9.66', '10.00'],
      watts: '4.50'
    },

    {
      group: {
        male: 4,
        female: 4
      },
      vermin: 'v10',
      font: ['7C', '7C+'],
      ircra: 25,
      yds: '5.13d',
      french: '8b',
      british: '7a',
      tech: null,
      ewbank: 31,
      brz: '10b',
      uiaa: ['X', 'X+'],
      uiaa_metric: ['10.00', '10.33'],
      watts: '4.75'
    },

    {
      group: {
        male: 4,
        female: 4
      },
      vermin: 'v11',
      font: '8A',
      ircra: 26,
      yds: '5.14a',
      french: '8b+',
      british: '7a',
      tech: null,
      ewbank: 32,
      brz: '10c',
      uiaa: ['X+', 'XI-'],
      uiaa_metric: ['10.33', '10.66'],
      watts: '5.00'
    },

    {
      group: {
        male: 4,
        female: 5
      },
      vermin: 'v12',
      font: '8A+',
      ircra: 27,
      yds: '5.14b',
      french: '8c',
      british: '7a',
      tech: '7b',
      ewbank: 33,
      brz: '11a',
      uiaa: 'XI-',
      uiaa_metric: '10.66',
      watts: '5.25'
    },

    {
      group: {
        male: 5,
        female: 5
      },
      vermin: 'v13',
      font: '8B',
      ircra: 28,
      yds: '5.14c',
      french: '8c+',
      british: null,
      tech: '7b',
      ewbank: 34,
      brz: '11b',
      uiaa: 'XI',
      uiaa_metric: '11.00',
      watts: '5.50'
    },

    {
      group: {
        male: 5,
        female: 5
      },
      vermin: 'v14',
      font: '8B+',
      ircra: 29,
      yds: '5.14d',
      french: '9a',
      british: null,
      tech: '7b',
      ewbank: 35,
      brz: '11c',
      uiaa: 'XI+',
      uiaa_metric: ['11.00', '11.33'],
      watts: '5.75'
    },

    {
      group: {
        male: 5,
        female: 5
      },
      vermin: ['v14', 'v15'],
      font: ['8B+', '8C'],
      ircra: 30,
      yds: '5.15a',
      french: '9a+',
      british: null,
      tech: '7b',
      ewbank: 36,
      brz: '12a',
      uiaa: ['XI+', 'XII-'],
      uiaa_metric: ['11.33', '11.66'],
      watts: '6.00'
    },

    {
      group: {
        male: 5,
        female: 5
      },
      vermin: 'v15',
      font: '8C',
      ircra: 31,
      yds: '5.15b',
      french: '9b',
      british: null,
      tech: '7b',
      ewbank: 37,
      brz: '12b',
      uiaa: 'XII-',
      uiaa_metric: '11.66',
      watts: '6.25'
    },

    {
      group: {
        male: 5,
        female: 5
      },
      vermin: 'v16',
      font: '8C+',
      ircra: 32,
      yds: '5.15c',
      french: '9b+',
      british: null,
      tech: '7b',
      ewbank: 38,
      brz: '12c',
      uiaa: 'XII',
      uiaa_metric: '12.00',
      watts: '6.50'
    }
  ]
}
