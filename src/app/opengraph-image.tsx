import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "logo.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f3f4f6",
      }}
    >
      <img src={logoSrc} height="250" alt="Logo" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "50px",
        }}
      >
        <div
          style={{
            fontSize: "140px",
            fontWeight: "bold",
            color: "#232F3E",
            fontFamily: "'Merriweather', Georgia, serif",
          }}
        >
          Chapter
        </div>
        <p
          style={{
            fontSize: "48px",
            color: "#6b7280",
            marginTop: "0px",
          }}
        >
          Audiobooks & Podcasts
        </p>
      </div>
    </div>,
  );
}
