<script>
import { Line, mixins } from 'vue-chartjs'
import { count } from '@/misc/helpers'

const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartdata: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    options: {
      legend: {
        // display: false
        position: 'bottom',
        align: 'start',
        labels: {
          // eslint-disable-next-line consistent-return
          filter(label) {
            if (label.text !== false) return true
          }
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              // unit: 'month',
              distribution: 'series',
              displayFormats: {
                quarter: 'MMM YYYY',
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH:mm'
              }
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              callback(label) {
                // if(label < 60){
                //     return label
                // }
                return count(label)
              }
            }
          }
        ]
      },
      tooltips: {
        enabled: false
      },
      responsive: true,
      maintainAspectRatio: true
    }
  }),
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
</script>
