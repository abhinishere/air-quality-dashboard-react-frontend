import "./readings-chart.scss";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { IReading } from "../../lib/data";
// pm options as series and pm field as dataKey; each device data will be used

interface ReadingsChartProps {
  data: IReading[] | null;
  device: string | null;
}
const pmOptions = [
  { title: "PM 1.0", value: "p1" },
  { title: "PM 2.5", value: "p25" },
  { title: "PM 10", value: "p10" },
];
export default function ReadingsChart({ data, device }: ReadingsChartProps) {
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  function createSeries() {
    return pmOptions.map((pmOption) => {
      return {
        name: pmOption.title,
        data: data?.map((obj: any) => obj[pmOption.value]),
      };
    });
  }

  const series = createSeries();

  // devices.map((device) => {
  //   name: "",
  //     data: (data! as any).map((a: any) => a[dataKey]),
  // })

  /*[
    {
      name: "",
      data: (data! as any).map((a: any) => a[dataKey]),
    },
  ];*/

  const options: ApexOptions = {
    theme: {
      mode: darkMode ? "dark" : "light",
    },
    chart: {
      id: "line-chart",
      background: darkMode ? "#1f1f1f" : "#fff",
    },
    legend: {
      position: "top",
    },
    xaxis: {
      tickAmount: 10,
      categories: (data! as any).map((a: any) =>
        moment(a["t"]).format("MM/DD,HH:mm")
      ),

      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    stroke: {
      width: 3, // Adjust line width as needed
    },
  };

  return (
    <div className="readings-chart">
      <div className="chart-container card">
        <div className="chart-wrapper">
          <ReactApexChart
            series={series as any}
            options={options}
            type="line"
            height="250px"
            width="100%"
          />
        </div>
        <div className="chart-info">{device}</div>
      </div>
    </div>
  );
}
