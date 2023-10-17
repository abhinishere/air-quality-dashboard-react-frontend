import OverviewBox from "../../components/overview-box/overview-box";
import PageHeading from "../../components/page-heading/page-heading";
import { IReading, overviewItems } from "../../lib/data";
import "./home.scss";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function Home() {
  var csvData: string;
  var parsedData: any;
  var [initialData, setInitialData] = useState<IReading[] | null>(null);

  function downsample(data: IReading[], factor: number) {
    const downsampledData = [];
    for (let i = 0; i < data.length; i += factor) {
      downsampledData.push(data[i]);
    }
    return downsampledData;
  }

  useEffect(() => {
    async function getData() {
      await fetch("./test_dataset_all.csv")
        .then((response) => response.text())
        .then((responseText) => {
          csvData = responseText;
        });
    }
    getData().then(() => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          parsedData = result.data;
          const downsampledData = downsample(parsedData, 200);

          setInitialData(downsampledData);
        },
      });
    });
  }, []);

  return (
    <div className="new-page home-page">
      <PageHeading
        heading="Overview"
        subHeading="This is a quick summary of important data points with respect to local downsampled deviceA CSV data."
      />
      {initialData ? (
        <div className="boxes">
          {overviewItems.map((item) => (
            <OverviewBox
              key={item.title}
              title={item.title}
              data={initialData}
              dataKey={item.dataKey}
            />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
