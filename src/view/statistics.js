import AbstractSmart from './abstract-smart.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {msToHumanizeTime} from '../utils/time.js';
import {getTypeNames, getSortedTypes, getTypeValues, getSortedByCountTypes, getSortedByTimeTypes} from '../utils/statistics.js';

const BAR_HEIGHT = 55;

const renderChart = (ctx, sortedTypes, formatter, text) => (
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: getTypeNames(sortedTypes),
      datasets: [{
        data: getTypeValues(sortedTypes),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends AbstractSmart {
  constructor(points) {
    super();

    this._data = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    moneyCtx.height = BAR_HEIGHT * 9;
    typeCtx.height = BAR_HEIGHT * 9;
    timeCtx.height = BAR_HEIGHT * 9;

    const sortedByPriceTypes = getSortedTypes(this._data, 'price');
    const sortedByCountTypes = getSortedByCountTypes(this._data);
    const sortedByTimeTypes = getSortedByTimeTypes(this._data);

    this._moneyChart = renderChart(moneyCtx, sortedByPriceTypes, (val) => `€ ${val}`, 'MONEY');
    this._typeChart = renderChart(typeCtx, sortedByCountTypes, (val) => `${val}x`, 'TYPE');
    this._timeChart = renderChart(timeCtx, sortedByTimeTypes, (val) => `${msToHumanizeTime(val)}`, 'TIME');
  }
}
