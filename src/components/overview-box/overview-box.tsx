import { useEffect, useState } from "react";
import "./overview-box.scss";
import ReactApexChart from "react-apexcharts";
import { IReading } from "../../lib/data";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";

interface OverviewBoxProps {
  title: string;
  data: IReading[] | null;
  dataKey: string;
}

export default function OverviewBox({
  title,
  data,
  dataKey,
}: OverviewBoxProps) {
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const [value, setValue] = useState<IReading | null>();
  useEffect(() => {
    if (data) {
      var max = data.reduce(function (prev, current) {
        if (+(current as any)[dataKey] > +(prev as any)[dataKey]) {
          return current;
        } else {
          return prev;
        }
      });
      setValue(max);
    }
  }, []);

  const series = [
    {
      name: dataKey,
      data: (data! as any).map((a: any) => a[dataKey]),
    },
  ];
  const options: ApexOptions = {
    theme: {
      mode: darkMode ? "dark" : "light",
    },
    chart: {
      id: "line-chart",
      background: "0",
      animations: {
        enabled: true, // Disable animations
      },
      toolbar: {
        show: false, // Hide the toolbar with download and zoom buttons
      },
      zoom: {
        enabled: false, // Disable zoom
      },
    },
    xaxis: {
      categories: (data! as any).map((a: any) => a["t"]),
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false, // Hide the grid lines
    },
    stroke: {
      width: 3, // Adjust line width as needed
    },
  };

  return (
    <div className="card overview-box">
      <div className="box-info">
        <div className="title">{title}</div>
        <div className="value">{value ? (value as any)[dataKey] : "-"}</div>
        <div className="description sub-text">
          t: {value ? value.t?.slice(0, -3) : ""}
        </div>
      </div>
      <div className="chart-info">
        <div className="chart">
          <ReactApexChart
            series={series}
            options={options}
            type="line"
            height="100%"
          />
          {/* <ResponsiveContainer width="99%" height="100%">
            <LineChart data={data!}>
              <Tooltip
                contentStyle={{
                  background: "transparent",
                  border: "none",
                }}
                labelStyle={{
                  display: "none",
                }}
                position={{
                  x: 80,
                  // y: 80,
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#0b57d0"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer> */}
        </div>
      </div>
    </div>
  );
}
