import MapContainer from './MapContainer.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/MapContainer',
  component: MapContainer,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    markers: [
      {
        location: {
          lat: '52.132633',
          lon: '5.291266'
        }
      }
    ],
    zoom: 8
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
