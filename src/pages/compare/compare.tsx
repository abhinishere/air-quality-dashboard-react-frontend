import "./compare.scss";
import PageHeading from "../../components/page-heading/page-heading";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CompareChart from "../../components/compare-chart/compare-chart";
import { API_URL, IReading } from "../../lib/data";

export interface ITimeRange {
  starttime: string;
  endtime: string;
}

export default function Compare() {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [chartData, setChartData] = useState<IReading[] | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeRangeEnabled, setTimeRangeEnabled] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<ITimeRange | null>(null);
  const pmOptions = [
    { title: "PM 1.0", value: "p1" },
    { title: "PM 2.5", value: "p25" },
    { title: "PM 10", value: "p10" },
  ];
  const [tempSelectedPmOption, setTempSelectedPmOption] =
    useState<string>("p1");
  function handlePmChange(option: string) {
    setTempSelectedPmOption(option);
  }

  function handleEnabledTimeRange(e: any) {
    if (e.target.checked) {
      setTimeRangeEnabled(true);
    } else {
      setTimeRangeEnabled(false);
    }
  }
  const [selectedPmOption, setSelectedPmOption] = useState<string>("p1");
  // const [pmAsKey, setPmAsKey] = useState("p1");

  const [selectedDevices, setSelectedDevices] = useState<string[]>(["DeviceA"]);
  async function compareHandler(e: any) {
    e.preventDefault();
    console.log("Comparing...");
    const devicesInput = e.target[0].value;

    if (devicesInput) {
      setSelectedDevices(
        devicesInput.split(",").map((item: string) => item.trim())
      );
    }
    // selectedDevices = [...new Set(selectedDevices)];

    if (timeRangeEnabled === true) {
      setTimeRange({
        starttime: e.target[2].value,
        endtime: e.target[3].value,
      });
    }

    if (selectedDevices.length > 0) {
      setSelectedPmOption(tempSelectedPmOption);
    }
  }

  function downsample(data: IReading[], factor: number) {
    const downsampledData = [];
    for (let i = 0; i < data.length; i += factor) {
      downsampledData.push(data[i]);
    }
    return downsampledData;
  }

  async function getReadings(
    devices: string,
    pm: string,
    timeRange?: ITimeRange | null
  ) {
    setIsLoading(true);
    console.log(`timerange is ${timeRange}`);
    try {
      const res = await fetch(
        timeRangeEnabled && timeRange
          ? `${API_URL}/api/reading/getreadings?devices=${devices}&pm=${pm}&starttime=${timeRange.starttime}&endtime=${timeRange.endtime}`
          : `${API_URL}/api/reading/getreadings?devices=${devices}&pm=${pm}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        //
        console.log("not ok");
        await res.json().then((body) => {
          console.log(body);
        });
        if (res.status === 401) {
          // refresh the token
          console.log("existing token expired... so refreshing!");
          const refreshResponse = await fetch(
            `${API_URL}/api/auth/refreshtoken`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                userId: userInfo.userId,
                refreshToken: userInfo.refreshToken,
              },
            }
          );
          if (!refreshResponse.ok) {
            toast.error("Authentication failed");
            throw new Error("Authentication failed");
          }
          console.log("token refreshed and authorization successful");
          await fetch(
            timeRangeEnabled && timeRange
              ? `${API_URL}/api/reading/getreadings?devices=${devices}&pm=${pm}&starttime=${timeRange.starttime}&endtime=${timeRange.endtime}`
              : `${API_URL}/api/reading/getreadings?devices=${devices}&pm=${pm}`,
            {
              method: "GET",
              credentials: "include",
            }
          ).then(async (reGetResponse) => {
            console.log(reGetResponse);
            if (!reGetResponse.ok) {
              console.log("Reading failed");
              throw new Error("Internal Server Error");
            }
            console.log("re-reading successful!");
            await reGetResponse.json().then((body) => {
              setChartData(downsample(body.data, 200));
              setIsLoading(false);
            });
          });

          return;
        }
        // some other error
        console.log(res);
        return;
      }

      await res.json().then((body) => {
        setChartData(downsample(body.data, 200));
        setIsLoading(false);
      });
    } catch (error: any) {}
  }

  useEffect(() => {
    // initially get the device A, PM1.0 data from server
    getReadings(String(selectedDevices), selectedPmOption, timeRange);
  }, [selectedPmOption, selectedDevices]);

  return (
    <div className="new-page compare-page">
      <PageHeading
        heading="Compare"
        subHeading="Comparison of PM1, PM2.5 and PM10 values at different locations, pulled from MongoDB through Express.js API server."
      />
      {/* comparison box starts */}
      <form onSubmit={compareHandler} className="compare-box card-box-shadow">
        <div className="form-input">
          <div className="label">Device Name (separated by commas)</div>
          <input name="devices" type="text" defaultValue="DeviceA" required />
        </div>
        <div>
          <div className="label">PM Size</div>
          <div className="options">
            {pmOptions.map((option) => (
              <div
                key={option.value}
                // change temporary selected pm option on click
                onClick={() => handlePmChange(option.value)}
                className={`option thin-border ${
                  tempSelectedPmOption === option.value
                    ? "selected-option"
                    : "unselected-option"
                }`}
              >
                {option.title}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="time-range-label">
            <div className="label">Add Time Range (YY/MM/DD,HH:mm:ss)</div>
            <input type="checkbox" onChange={handleEnabledTimeRange} />
          </div>
          <input
            className="time-range-input"
            type="text"
            name="from-time"
            disabled={!timeRangeEnabled}
            required
          />
          <input
            className="time-range-input"
            type="text"
            name="to-time"
            disabled={!timeRangeEnabled}
            required
          />
        </div>
        <button>Compare</button>
      </form>
      {/* comparison box ends */}
      {/* charts start here */}
      {isLoading || !chartData ? (
        <span className="loader" />
      ) : (
        <div className="simple-chart">
          <CompareChart
            data={chartData}
            dataKey={selectedPmOption}
            devices={selectedDevices}
          />
        </div>
      )}
    </div>
  );
}
