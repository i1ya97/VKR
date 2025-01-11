const MaskStripe = () => {
  return (
    <defs>
      <pattern
        id="pattern-stripe"
        patternUnits="userSpaceOnUse"
        viewBox="0 0 20 20"
        width="8"
        height="8"
        patternTransform="rotate(60)"
      >
        <rect width="10" height="20" fill="white" />
      </pattern>
      <mask id="mask-stripe">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripe)" />
      </mask>
    </defs>
  );
};

export default MaskStripe;
