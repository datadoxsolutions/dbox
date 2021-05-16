import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';

declare const $: any;
declare const Chart: any;
declare const echarts: any;
declare const window: any;


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit() {
    'use strict'
    this.startScript();
  }

  async startScript() {
    await this.dynamicScriptLoader.load('echart').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    'use strict'

    /* Chart data*/
    var chartdata1 = [
      {
        name: 'sales',
        type: 'bar',
        data: [11, 14, 8, 16, 11, 13]
      },
      {
        name: 'profit',
        type: 'line',
        smooth: true,
        data: [10, 7, 17, 11, 15],
        symbolSize: 10,
      },
      {
        name: 'growth',
        type: 'bar',
        data: [10, 14, 10, 15, 9, 25]
      }
    ];

    var draw = Chart.controllers.line.prototype.draw;
    Chart.controllers.lineShadow = Chart.controllers.line.extend({
      draw: function () {
        draw.apply(this, arguments);
        var ctx = this.chart.chart.ctx;
        var _stroke = ctx.stroke;
        ctx.stroke = function () {
          ctx.save();
          ctx.shadowColor = '#00000075';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 8;
          ctx.shadowOffsetY = 8;
          _stroke.apply(this, arguments)
          ctx.restore();
        }
      }
    });

    var chart = document.getElementById('echart_pie');
    var barChart = echarts.init(chart);

    barChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        x: "center",
        y: "bottom",
        textStyle: { color: '#9aa0ac' },
        data: ["Maharastra", "Pune", "Delhi", "Gujrat", "Mumbai"]
      },

      calculable: !0,
      series: [{
        name: "Chart Data",
        type: "pie",
        radius: "55%",
        center: ["50%", "48%"],
        data: [{
          value: 22,
          name: "Maharastra"
        }, {
          value: 10,
          name: "Pune"
        }, {
          value: 34,
          name: "Delhi"
        }, {
          value: 5,
          name: "Gujrat"
        }, {
          value: 8,
          name: "Mumbai"
        }]
      }],
      color: ['#575B7A', '#DE725C', '#DFC126', '#72BE81', '#50A5D8']
    });

    $(function () {


      $('#chat-conversation').slimscroll({
        height: '264px',
        size: '5px'
      });
      initCardChart();
      initSparkline();
      initLineChart();
      initSalesChart();
      initSalesNewChart();
      initChartReport1();
      initChartReport2();
    });

    function initCardChart() {


      //Chart Bar
      $('.chart.chart-bar').sparkline([6, 4, 8, 6, 8, 10, 5, 6, 7, 9, 5, 6, 4, 8, 6, 8, 10, 5, 6, 7, 9, 5], {
        type: 'bar',
        barColor: '#FF9800',
        negBarColor: '#fff',
        barWidth: '4px',
        height: '45px'
      });


      //Chart Pie
      $('.chart.chart-pie').sparkline([30, 35, 25, 8], {
        type: 'pie',
        height: '45px',
        sliceColors: ['#65BAF2', '#F39517', '#F44586', '#6ADF42']
      });


      //Chart Line
      $('.chart.chart-line').sparkline([9, 4, 6, 5, 6, 4, 7, 3], {
        type: 'line',
        width: '60px',
        height: '45px',
        lineColor: '#65BAF2',
        lineWidth: 2,
        fillColor: 'rgba(0,0,0,0)',
        spotColor: '#F39517',
        maxSpotColor: '#F39517',
        minSpotColor: '#F39517',
        spotRadius: 3,
        highlightSpotColor: '#F44586'
      });

      // live chart
      var mrefreshinterval = 500; // update display every 500ms
      var lastmousex = -1;
      var lastmousey = -1;
      var lastmousetime;
      var mousetravel = 0;
      var mpoints = [];
      var mpoints_max = 30;
      $('html').on("mousemove", function (e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
          mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
        }
        lastmousex = mousex;
        lastmousey = mousey;
      });
      var mdraw = function () {
        var md = new Date();
        var timenow = md.getTime();
        if (lastmousetime && lastmousetime != timenow) {
          var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
          mpoints.push(pps);
          if (mpoints.length > mpoints_max)
            mpoints.splice(0, 1);
          mousetravel = 0;
          $('#liveChart').sparkline(mpoints, {
            width: mpoints.length * 2,
            height: '45px',
            tooltipSuffix: ' pixels per second'
          });
        }
        lastmousetime = timenow;
        setTimeout(mdraw, mrefreshinterval);
      };
      // We could use setInterval instead, but I prefer to do it this way
      setTimeout(mdraw, mrefreshinterval);
    }

    function initChartReport1() {
      var canvas = <HTMLCanvasElement>document.getElementById("chartReport1");
      // Apply multiply blend when drawing datasets
      var multiply = {
        beforeDatasetsDraw: function (chart, options, el) {
          chart.ctx.globalCompositeOperation = 'multiply';
        },
        afterDatasetsDraw: function (chart, options) {
          chart.ctx.globalCompositeOperation = 'source-over';
        },
      };

      // Gradient color - this week
      var gradientThisWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientThisWeek.addColorStop(0, '#5555FF');
      gradientThisWeek.addColorStop(1, '#9787FF');

      // Gradient color - previous week
      var gradientPrevWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientPrevWeek.addColorStop(0, '#FF55B8');
      gradientPrevWeek.addColorStop(1, '#FF8787');


      var config = {
        type: 'line',
        data: {
          labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          datasets: [
            {
              label: 'This week',
              data: [24, 18, 16, 18, 24, 36, 28],
              backgroundColor: gradientThisWeek,
              borderColor: 'transparent',
              pointBackgroundColor: '#FFFFFF',
              pointBorderColor: '#FFFFFF',
              lineTension: 0.40,
            },
            {
              label: 'Previous week',
              data: [20, 22, 30, 22, 18, 22, 30],
              backgroundColor: gradientPrevWeek,
              borderColor: 'transparent',
              pointBackgroundColor: '#FFFFFF',
              pointBorderColor: '#FFFFFF',
              lineTension: 0.40,
            }
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0,
              hitRadius: 5,
              hoverRadius: 5
            }
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              display: false,
            }],
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
              },
            }]
          }
        },
        plugins: [multiply],
      };

      window.chart = new Chart(canvas, config);
    }

    function initChartReport2() {
      var canvas = <HTMLCanvasElement>document.getElementById("chartReport2");

      var gradientBlue = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientBlue.addColorStop(0, 'rgba(85, 85, 255, 0.9)');
      gradientBlue.addColorStop(1, 'rgba(151, 135, 255, 0.8)');

      var gradientHoverBlue = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientHoverBlue.addColorStop(0, 'rgba(65, 65, 255, 1)');
      gradientHoverBlue.addColorStop(1, 'rgba(131, 125, 255, 1)');

      var gradientRed = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientRed.addColorStop(0, 'rgba(255, 85, 184, 0.9)');
      gradientRed.addColorStop(1, 'rgba(255, 135, 135, 0.8)');

      var gradientHoverRed = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
      gradientHoverRed.addColorStop(0, 'rgba(255, 65, 164, 1)');
      gradientHoverRed.addColorStop(1, 'rgba(255, 115, 115, 1)');

      var redArea = null;
      var blueArea = null;

      var shadowed = {
        beforeDatasetsDraw: function (chart, options) {
          chart.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          chart.ctx.shadowBlur = 40;
        },
        afterDatasetsDraw: function (chart, options) {
          chart.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
          chart.ctx.shadowBlur = 0;
        }
      };

      var days = Last7Days().split(',');
      window.chart = new Chart(document.getElementById("chartReport2"), {
        type: "radar",
        data: {
          labels: days,
          datasets: [{
            label: "New Invoice",
            data: [5, 9, 9, 1, 3, 2, 2],
            fill: true,
            backgroundColor: gradientRed,
            borderColor: 'transparent',
            pointBackgroundColor: "transparent",
            pointBorderColor: "transparent",
            pointHoverBackgroundColor: "transparent",
            pointHoverBorderColor: "transparent",
            pointHitRadius: 50,
          }, {
            label: "Close Invoice",
            data: [4, 10, 4, 9, 4, 9, 4],
            fill: true,
            backgroundColor: gradientBlue,
            borderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointBorderColor: "transparent",
            pointHoverBackgroundColor: "transparent",
            pointHoverBorderColor: "transparent",
            pointHitRadius: 50,
          }]
        },
        options: {
          legend: {
            display: false,
          },
          gridLines: {
            display: false
          },
          scale: {
            ticks: {
              maxTicksLimit: 1,
              display: false,
            }
          }
        },
        plugins: [shadowed]
      });

    }
    function initSparkline() {
      $(".sparkline").each(function () {
        var $this = $(this);
        $this.sparkline('html', $this.data());
      });
    }

    function initLineChart() {
      try {

        //line chart
        var ctx = <HTMLCanvasElement>document.getElementById("lineChart");
        if (ctx) {
          ctx.height = 150;
          var days = Last7Days().split(',');
          var myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: days,
              defaultFontFamily: "Poppins",
              datasets: [
                {
                  label: "Open",
                  borderColor: "rgba(0, 123, 255, 0.9)",
                  borderWidth: "1",
                  backgroundColor: "rgba(0, 123, 255, 0.5)",
                  pointHighlightStroke: "rgba(26,179,148,1)",
                  data: [16, 32, 18, 26, 42, 33, 44]
                },
                {
                  label: "Complete",
                  borderColor: "rgba(0, 124, 255, 0.9)",
                  borderWidth: "1",
                  backgroundColor: "rgba(0, 123, 255, 0.5)",
                  pointHighlightStroke: "rgba(26,179,148,1)",
                  data: [4, 6, 13, 16, 12, 13, 14]
                }
              ]
            },
            options: {
              legend: {
                position: 'top',
                labels: {
                  fontFamily: 'Poppins'
                }

              },
              responsive: true,
              tooltips: {
                mode: 'index',
                intersect: false
              },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontFamily: "Poppins"

                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontFamily: "Poppins"
                  }
                }]
              }

            }
          });
        }


      } catch (error) {
        console.log(error);
      }

      try {
        //bar chart
        var ctx = <HTMLCanvasElement>document.getElementById("bar-chart");
        if (ctx) {
          ctx.height = 178;
          var myChart = new Chart(ctx, {
            type: 'bar',
            defaultFontFamily: 'Poppins',
            data: {
              labels: ["I9403", "I8476", "I3467", "I2392", "I8473", "I8988", "I9374"],
              datasets: [
                {
                  label: "Ageing Days",
                  data: [5, 12, 8, 13, 18, 12, 9],
                  borderColor: "rgba(0, 123, 255, 0.9)",
                  borderWidth: "0",
                  backgroundColor: "rgba(0, 123, 255, 0.5)",
                  fontFamily: "Poppins"
                }
              ]
            },
            options: {
              legend: {
                position: 'top',
                labels: {
                  fontFamily: 'Poppins',
                  fontColor: "#9aa0ac", // Font Color
                }

              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color

                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color
                  }
                }]
              }
            }
          });
        }


      } catch (error) {
        console.log(error);
      }

      try {

        // single bar chart
        var ctx = <HTMLCanvasElement>document.getElementById("singel-bar-chart");
        if (ctx) {
          ctx.height = 115;
          var days = Last7Days().split(',');
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: days,
              datasets: [
                {
                  label: "Invoice",
                  data: [400, 535, 275, 281, 516, 535, 340],
                  borderColor: "rgba(0, 123, 255, 0.9)",
                  borderWidth: "0",
                  backgroundColor: "rgba(0, 123, 255, 0.5)"
                }
              ]
            },
            options: {
              legend: {
                position: 'top',
                labels: {
                  fontFamily: 'Poppins',
                  fontColor: "#9aa0ac", // Font Color
                }

              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color

                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color
                    callback(value, index, values) {
                        return '₹' + value;
                    }
                  }
                }]
              }
            }
          });
        }

      } catch (error) {
        console.log(error);
      }
    }

    function initSalesChart() {

      try {
        //Sales chart
        var ctx = <HTMLCanvasElement>document.getElementById("sales-chart");
        if (ctx) {
          ctx.height = 150;
          var myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
              type: 'line',
              defaultFontFamily: 'Poppins',
              datasets: [{
                label: "SLA",
                data: [0, 30, 10, 120, 50, 63, 10],
                backgroundColor: 'transparent',
                borderColor: '#222222',
                borderWidth: 2,
                pointStyle: 'circle',
                pointRadius: 3,
                pointBorderColor: 'transparent',
                pointBackgroundColor: '#222222',
              }, {
                label: "Electronics",
                data: [0, 50, 40, 80, 40, 79, 120],
                backgroundColor: 'transparent',
                borderColor: '#f96332',
                borderWidth: 2,
                pointStyle: 'circle',
                pointRadius: 3,
                pointBorderColor: 'transparent',
                pointBackgroundColor: '#f96332',
              }]
            },
            options: {
              responsive: true,
              tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                titleFontFamily: 'Poppins',
                bodyFontFamily: 'Poppins',
                cornerRadius: 3,
                intersect: false,
              },
              legend: {
                display: false,
                labels: {
                  usePointStyle: true,
                  fontFamily: 'Poppins',
                },
              },
              scales: {
                xAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'Month'
                  },
                  ticks: {
                    fontFamily: "Poppins"
                  }
                }],
                yAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Value',
                    fontFamily: "Poppins"

                  },
                  ticks: {
                    fontFamily: "Poppins"
                  }
                }]
              },
              title: {
                display: false,
                text: 'Normal Legend'
              }
            }
          });
        }


      } catch (error) {
        console.log(error);
      }
    }

    function initSalesNewChart() {

      try {
        //Sales chart
        var ctx = <HTMLCanvasElement>document.getElementById("line-chart2");
        if (ctx) {
          ctx.height = 150;
          var myChart = new Chart(ctx, {
            type: 'lineShadow',
            data: {
              labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
              type: 'line',
              defaultFontFamily: 'Poppins',
              datasets: [{
                label: "SLA",
                data: [0, 30, 10, 120, 50, 63, 10],
                backgroundColor: 'transparent',
                borderColor: '#222222',
                borderWidth: 2,
                pointStyle: 'circle',
                pointRadius: 3,
                pointBorderColor: 'transparent',
                pointBackgroundColor: '#222222',
              }]
            },
            options: {
              responsive: true,
              tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                titleFontFamily: 'Poppins',
                bodyFontFamily: 'Poppins',
                cornerRadius: 3,
                intersect: false,
              },
              legend: {
                display: false,
                labels: {
                  usePointStyle: true,
                  fontFamily: 'Poppins',
                },
              },
              scales: {
                xAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'Month'
                  },
                  ticks: {
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color
                  }

                }],
                yAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Value',
                    fontFamily: "Poppins"

                  },
                  ticks: {
                    fontFamily: "Poppins",
                    fontColor: "#9aa0ac", // Font Color
                  }
                }]
              },
              title: {
                display: false,
                text: 'Normal Legend'
              }
            }
          });
        }


      } catch (error) {
        console.log(error);
      }
    }

    function Last7Days() {
      return '6543210'.split('').map(function(n: any) {
        var d = new Date();
        d.setDate(d.getDate() - n);
  
        return (function(day, month, year) {
            return [day<10 ? '0'+day : day, month<10 ? '0'+month : month, year].join('/');
        })(d.getDate(), d.getMonth()+1, d.getFullYear());
      }).join(',');
    }

  }

}
