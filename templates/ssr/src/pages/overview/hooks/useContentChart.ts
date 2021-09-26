import * as echarts from "echarts";
import { ref } from "vue";
import { getDateRange } from "helper/utils";

export default function useContentChart(id: string, color: string[]) {
  const contentTime = ref(7);
  const contentOptions = [
    {
      label: "近7天",
      value: 7,
    },
    {
      label: "近30天",
      value: 30,
    },
  ];
  async function onContentChange(val) {
    const chart = echarts.init(document.getElementById(id));
    const dateRange = getDateRange(-val, "MM-dd");
    chart.showLoading();
    setTimeout(() => {
      chart.setOption(getOptions(dateRange));
      chart.hideLoading();
    }, 888);
  }
  function getOptions(xDatas: string[]) {
    const articles = [];
    const resources = [];
    const oriArticles = [];
    const oriResources = [];
    xDatas.forEach(() => {
      const temp1 = Math.floor(Math.random() * 90 + 10);
      articles.push(temp1);
      oriArticles.push(Math.floor(temp1 / 2));
      const temp2 = Math.floor(Math.random() * 90 + 10);
      resources.push(temp2);
      oriResources.push(Math.floor(temp2 / 2));
    });
    return {
      color,
      title: [
        {
          text: "新增",
          left: "1%",
          textStyle: {
            color: "#90979c",
          },
        },
        {
          text: "原创占比",
          left: "86%",
          textAlign: "center",
          textStyle: {
            color: "#90979c",
          },
        },
      ],
      tooltip: {
        trigger: "axis",
      },
      legend: {
        x: 300,
        data: ["专栏", "资源"],
      },
      grid: {
        left: "1%",
        right: "25%",
        top: "16%",
        bottom: "6%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "#90979c",
          },
        },
        boundaryGap: false,
        data: xDatas,
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            color: "#90979c",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#90979c",
          },
        },
        type: "value",
      },
      series: [
        {
          name: "专栏",
          smooth: true,
          type: "line",
          symbolSize: 8,
          symbol: "circle",
          data: articles,
        },
        {
          name: "资源",
          smooth: true,
          type: "line",
          symbolSize: 8,
          symbol: "circle",
          data: resources,
        },
        {
          type: "pie",
          center: ["88%", "33%"],
          radius: ["28%", "35%"],
          hoverAnimation: false,
          cursor: "default",
          label: {
            normal: {
              position: "center",
              rich: {
                a: {
                  align: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                },
                b: {
                  align: "center",
                  fontSize: 14,
                },
              },
              formatter: function (params) {
                return `{a|${params.percent}}% \n\n{b|专栏}`;
              },
            },
          },
          data: [
            {
              value: 233,
              name: "原创专栏",
            },
            {
              value: 158,
              name: "非原创专栏",
              label: {
                normal: {
                  show: false,
                },
              },
            },
          ],
        },
        {
          type: "pie",
          center: ["88%", "72%"],
          radius: ["28%", "35%"],
          label: {
            normal: {
              position: "center",
              rich: {
                a: {
                  align: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                },
                b: {
                  align: "center",
                  fontSize: 14,
                },
              },
              formatter: function (params) {
                return `{a|${params.percent}}% \n\n{b|资源}`;
              },
            },
          },
          hoverAnimation: false,
          cursor: "default",
          data: [
            {
              value: 123,
              name: "原创资源",
            },
            {
              value: 23,
              name: "非原创资源",
              label: {
                normal: {
                  show: false,
                },
              },
            },
          ],
        },
      ],
    };
  }
  function render() {
    onContentChange(contentTime.value);
  }
  return {
    render,
    config: {
      contentTime,
      contentOptions,
      onContentChange,
    },
  };
}
