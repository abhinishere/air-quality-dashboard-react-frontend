import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { IReading } from "../../lib/data";

interface CompareChartProps {
  data: IReading[] | null;
  dataKey: string;
  devices: string[];
}

export default function CompareChart({
  data,
  dataKey,
  devices,
}: CompareChartProps) {
  const darkMode = useSelector((state: any) => state.theme.darkMode);

  function createSeries() {
    return devices.map((device: string) => {
      return {
        name: device,
        data: data
          ?.filter((obj: any) => obj.device === device)
          .map((obj: any) => obj[dataKey]),
      };
    });
  }

  const series = createSeries();

  const options: ApexOptions = {
    theme: {
      mode: darkMode ? "dark" : "light",
    },
    chart: {
      id: "line-chart",
      background: darkMode ? "#1f1f1f" : "#fff",
    },
    xaxis: {
      tickAmount: 10,
      categories: (data! as any).map((a: any) =>
        moment(a["t"]).format("YY/MM/DD,HH:mm:ss")
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
    <div className="compare-chart">
      <ReactApexChart
        series={series as any}
        options={options}
        type="line"
        height="400px"
        width="100%"
      />
    </div>
  );
}
