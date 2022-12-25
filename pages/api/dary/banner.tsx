import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const getFontData = () => {
  const url = new URL("public/PTSerif-Bold.ttf", import.meta.url);
  return fetch(url.toString()).then((res) => res.arrayBuffer());
};

const parsePercentage = (val: string) => {
  const int = parseInt(val);
  return isNaN(int) ? 0 : Math.min(Math.max(0, int), 100);
};

export default async function (req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const percentage = parsePercentage(searchParams.get("percentage") || "0");
  const width = (percentage / 100) * 656;
  const line1 = `za posledních 12 měsíců vybráno ${percentage} %`;
  const line2 = `z 200 tisíc, které od čtenářů ročně potřebujeme`;
  const fontData = await getFontData();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {/*eslint-disable-next-line @next/next/no-img-element*/}
        <img
          src="https://i.ohlasy.info/i/74a58a89.png"
          width="720"
          height="720"
          alt=""
        />
        <p
          style={{
            flexDirection: "column",
            position: "absolute",
            color: "white",
            top: "533px",
            alignItems: "center",
            width: "100%",
            fontFamily: "PT Serif",
            fontSize: "24px",
            paddingLeft: "70px",
            paddingRight: "70px",
          }}
        >
          <span>{line1}</span>
          <span>{line2}</span>
        </p>
        <div
          style={{
            position: "absolute",
            top: "635px",
            left: "30px",
            background: "white",
            width: `${width}px`,
            height: "50px",
          }}
        ></div>
      </div>
    ),
    {
      width: 720,
      height: 720,
      fonts: [
        {
          name: "PT Serif",
          style: "normal",
          data: fontData,
        },
      ],
    }
  );
}
