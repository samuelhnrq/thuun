function Loading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 25 100 50"
      preserveAspectRatio="xMidYMid slice"
      style={{
        background: "0 0",
        height: "25px",
        overflow: "hidden",
      }}
      display="block"
    >
      <title>Loading</title>
      <circle fill="#e15b64" r="10" cy="50" cx="84">
        <animate
          begin="0s"
          keySplines="0 0.5 0.5 1"
          values="7;0"
          keyTimes="0;1"
          calcMode="spline"
          dur="0.8928571428571428s"
          repeatCount="indefinite"
          attributeName="r"
        />
        <animate
          begin="0s"
          values="#e15b64;#abbd81;#f8b26a;#f47e60;#e15b64"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="discrete"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="fill"
        />
      </circle>
      <circle fill="#e15b64" r="10" cy="50" cx="16">
        <animate
          begin="0s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="0;0;7;7;7"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="r"
        />
        <animate
          begin="0s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="16;16;16;50;84"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="cx"
        />
      </circle>
      <circle fill="#f47e60" r="10" cy="50" cx="50">
        <animate
          begin="-0.8928571428571428s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="0;0;7;7;7"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="r"
        />
        <animate
          begin="-0.8928571428571428s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="16;16;16;50;84"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="cx"
        />
      </circle>
      <circle fill="#f8b26a" r="10" cy="50" cx="84">
        <animate
          begin="-1.7857142857142856s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="0;0;7;7;7"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="r"
        />
        <animate
          begin="-1.7857142857142856s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="16;16;16;50;84"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="cx"
        />
      </circle>
      <circle fill="#abbd81" r="10" cy="50" cx="16">
        <animate
          begin="-2.6785714285714284s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="0;0;7;7;7"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="r"
        />
        <animate
          begin="-2.6785714285714284s"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
          values="16;16;16;50;84"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          dur="3.571428571428571s"
          repeatCount="indefinite"
          attributeName="cx"
        />
      </circle>
    </svg>
  );
}

export default Loading;
export { Loading };
