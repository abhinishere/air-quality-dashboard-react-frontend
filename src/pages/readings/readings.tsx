import "./readings.scss";

import { useSelector } from "react-redux";
import PageHeading from "../../components/page-heading/page-heading";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import ReadingsChart from "../../components/readings-chart/readings-chart";
import { API_URL, IReading } from "../../lib/data";
import { X } from "lucide-react";

// displaying readings process
// fetch -> organize the data -> downsampling -> display

export default function ReadingsImproved() {
  //  status - initialized - fetched -> organized -> completed -> reinitialized
  const [status, setStatus] = useState<string>("initialized");

  // useRef might be a better choice for handling status
  const unorganizedData = useRef<any>();
  const chartData = useRef<any>();

  const { userInfo } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([
    "DeviceA",
    "DeviceB",
    "DeviceC",
  ]);

  function organizeTheData(data: any, field: string) {
    const grouped: any = {};

    for (const obj of data) {
      const value = obj[field];

      if (!grouped[value]) {
        grouped[value] = [];
      }

      grouped[value].push(obj);
    }
    const result = Object.values(grouped);
    unorganizedData.current = null;
    return result;
  }

  async function uploadToApiServer(e: any) {
    let file = e.target.files[0];

    if (!file) {
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/reading/upload`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      if (!res.ok && !(res.status === 502)) {
        if (res.status === 401) {
          // refresh the token
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
          // token refreshed and authorization successful
          const reuploadResponse = await fetch(
            `${API_URL}/api/reading/upload`,
            {
              method: "POST",
              credentials: "include",
              body: fd,
            }
          );

          if (reuploadResponse.ok || reuploadResponse.status === 502) {
            // firebase rewrite only waits up to 60 seconds to get response from the server
            // may not fit the window for large files
            toast.error("Upload successful!");
            return;
          }
          toast.error("Upload failed.");
          throw new Error("Internal Server Error");
        }

        // some other error

        toast.error("Upload failed.");
        return;
      }

      // what to do after excel file upload successful

      toast.success("Upload successful!");
    } catch (error) {
      console.log(error);
    }
  }

  function downsample(data: IReading[], factor: number) {
    const downsampledData = [];
    for (let i = 0; i < data.length; i += factor) {
      downsampledData.push(data[i]);
    }
    return downsampledData;
  }

  async function getAllReadings(devices: string) {
    setStatus("reinitialized");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/reading/getalldata?devices=${devices}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.log("res not ok");
        // not ok

        if (res.status === 401) {
          // refresh token

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
          //  token refreshed and authorization successful
          await fetch(`${API_URL}/api/reading/getalldata?devices=${devices}`, {
            method: "GET",
            credentials: "include",
          }).then(async (reGetResponse) => {
            if (!reGetResponse.ok) {
              // Reading failed
              throw new Error("Internal Server Error");
            }
            //  re-reading successful!
            await reGetResponse.json().then((body) => {
              unorganizedData.current = body.data;
              setStatus("fetched");
            });
          });
          return;
        }

        // some other error
        return;
      }

      await res.json().then((body) => {
        unorganizedData.current = body.data;
        setStatus("fetched");
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // get all the readings initially
    getAllReadings(String(selectedDevices));
  }, [selectedDevices]);

  useEffect(() => {
    if (isLoading && status === "fetched") {
      chartData.current = organizeTheData(unorganizedData.current, "device");
      setStatus("organized");
    }
    if (status === "organized") {
      setIsLoading(false);
      setStatus("completed");
    }
  }, [isLoading, status]);

  return (
    <div className="new-page readings-page">
      <PageHeading
        heading="Readings"
        subHeading="Analysis of the levels of different PM sizes throughout the day, pulled from MongoDB through Express API server."
      >
        {/* excel file upload button */}
        <input
          accept=".xlsx"
          onChange={uploadToApiServer}
          type="file"
          name="excel-upload"
          id="excel-upload"
          hidden
        />
        <button
          onClick={() => {
            document.getElementById("excel-upload")?.click();
          }}
        >
          Upload
        </button>
      </PageHeading>
      <div className="test">
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            const value = e.target[0].value.trim();
            if (value !== "") {
              setSelectedDevices((existingDevices) => [
                ...existingDevices,
                e.target[0].value,
              ]);
            }
          }}
          className="add-device-wrapper"
        >
          <input
            className="add-device-input thin-border"
            type="text"
            placeholder="Add device to the view"
          />
          <button>Add</button>
        </form>
        <div className="list-selected-devices">
          {selectedDevices.map((device) => (
            <div key={device} className="device-container thin-border">
              <div className="device ">{device}</div>
              <X
                className="x-remove"
                onClick={() =>
                  setSelectedDevices(
                    selectedDevices.filter((item) => item !== device)
                  )
                }
                size="15px"
              />
            </div>
          ))}
        </div>
      </div>
      {selectedDevices.length === 0 ? (
        <div>Nothing to show</div>
      ) : isLoading && status !== "organized" ? (
        <span className="loader" />
      ) : (
        <div className="charts-grid">
          {chartData.current.map((deviceReadings: any) => (
            <ReadingsChart
              key={`${deviceReadings[0].device}`}
              data={downsample(deviceReadings, 200)}
              device={deviceReadings[0].device}
            />
          ))}
        </div>
      )}
    </div>
  );
}
