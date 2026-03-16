"use client";

import CountUp from "react-countup";

const stats = [
  {
    num: 4,
    suffix: "+",
    text: "Years Experience",
  },
  {
    num: 5,
    text: "Languages Spoken",
  },
  {
    num: 100,
    suffix: "+",
    text: "Countries Served",
  },
];

export const Stats = () => {
  return (
    <div className="flex justify-center gap-12 xl:gap-16">
      {stats.map((item, index) => (
        <div className="flex flex-col items-center gap-1" key={index}>
          <div className="text-3xl xl:text-4xl font-extrabold text-heading">
            <CountUp end={item.num} duration={3} delay={0} />
            {item.suffix}
          </div>
          <p className="text-xs xl:text-sm text-muted font-medium">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};
