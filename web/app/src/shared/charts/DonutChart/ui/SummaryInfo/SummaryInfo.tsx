interface Props {
  radius: number;
  textColor: string;
  title?: string;
  subTitle?: string;
}

export const SummaryInfo = (props: Props) => {
  const { textColor, title, subTitle, radius } = props;

  return (
    <>
      {subTitle && (
        <text
          x={radius}
          y={title ? radius - 8 : radius}
          fontSize={14}
          fill={textColor}
          opacity={0.64}
          textAnchor="middle"
        >
          {subTitle}
        </text>
      )}
      {title && (
        <text
          x={radius}
          y={subTitle ? radius + 12 : radius}
          fontSize={16}
          fill={textColor}
          opacity={0.87}
          textAnchor="middle"
        >
          {title}
        </text>
      )}
    </>
  );
};
