import Highcharts from 'highcharts';
import moment from 'moment';

export function setChartOptions(options) {
  const {
    type,
    primaryData,
    secondaryData,
    primaryLabel,
    secondaryLabel,
    title,
    subtitle
  } = options;

  return {
    chart: {
      zoomType: 'x',
      type: 'areaspline' // for curvy lines
    },
    style: {
      fontFamily: 'Source Sans Pro'
    },
    title: {
      align: 'left',
      text: title
    },
    subtitle: {
      align: 'left',
      text: subtitle,
      style: { color: '#969696' }
    },
    xAxis: {
      type: 'datetime',
      /* Override all time display to always show a 12AM style format */
      dateTimeLabelFormats: {
        millisecond: '%l:%M:%S.%L',
        second: '%l:%M:%S',
        minute: '%l:%M %p',
        hour: '%l %p',
        day: '%l %p',
        week: '%l %p',
        month: '%l %p',
        year: '%l %p'
      },
      gridLineDashStyle: 'Dot',
      gridLineColor: '#d1d1d1',
      gridLineWidth: 2,
      labels: {
        align: 'left',
        useHTML: true,
        // x: -10,
        step: 1, // adjusts how many labels to show on the graph
        formatter() {
          return this.axis.defaultLabelFormatter.call(this);
        }
      },
      minPadding: 0,
      maxPadding: 0
    },
    yAxis: {
      className: 'charts-y-axis',
      gridLineColor: '#fff',
      title: {
        text: null
      },
      showLastLabel: false,
      labels: {
        align: 'left',
        x: 25,
        y: 0,
        step: 1,
        formatter() {
          if (this.value > 0) {
            switch (type) {
              case 'DECIMAL':
                return `${Math.floor(this.value)}`;
              case 'CURRENCY':
                return `$${this.value}`;
              case 'PERCENT':
                return `${this.value} %`;
              default:
                return this.value;
            }
          }
        },
        useHTML: true
      }
    },
    tooltip: {
      shared: true
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      areaspline: {
        marker: {
          enabled: false,
          radius: 2
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      }
    },
    series: [
      /* secondary data with gray fill */
      {
        color: 'rgba(150, 150, 150, 1)',
        fillColor: 'rgba(150, 150, 150, 0.4)',
        data: secondaryData,
        name: secondaryLabel
      },
      /* primary data with orange fill */
      {
        color: 'rgba(255, 117, 25, 1)',
        fillColor: 'rgba(255, 117, 25, 0.6)',
        data: primaryData,
        name: primaryLabel
      }
    ],
    credits: {
      enabled: false
    }
  };
}
