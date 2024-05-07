import { ReactNode } from "react";

interface ImageResponseProps {
  title?: string;
  description?: string;
  style?: {
    bgColor: string;
    fontStyle: string;
  };
}

export const ImageResponseComponent = ({
  title,
  description,
  style,
}: ImageResponseProps) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: style?.bgColor,
        fontSize: 40,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      <p
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 124, 160))",
          backgroundClip: "text",
          color: "transparent",
          fontSize: 40,
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            color: "transparent",
            fontSize: 80,
            fontWeight: 700,
            margin: 0,
            marginTop: 20,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
