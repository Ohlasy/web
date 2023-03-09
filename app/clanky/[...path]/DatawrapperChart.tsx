"use client";

// @ts-ignore, TBD: fix later, types are missing
import DWChart from "react-datawrapper-chart";

type Props = {
  id: string;
  version?: number;
  title?: string;
};

export const DatawrapperChart = ({
  id,
  version = 1,
  title = "Graf",
}: Props) => (
  <DWChart
    title={title}
    src={`https://datawrapper.dwcdn.net/${id}/${version}`}
    loading="lazy"
  />
);
