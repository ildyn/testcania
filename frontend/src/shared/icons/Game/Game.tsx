import { FC } from 'react';

export type IconProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

export const GameLogo: FC<IconProps> = ({
  width = 99,
  height = 86,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 99 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_665_1034)">
        <mask
          id="mask0_665_1034"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="-1"
          width="199"
          height="87"
        >
          <path
            d="M24.7994 24.5646C39.9456 10.7494 59.7065 3.09085 80.2069 3.09085H117.796C138.296 3.09085 158.057 10.7494 173.203 24.5646L193.415 42.9999L173.203 61.4352C158.057 75.2504 138.296 82.9089 117.795 82.9089H80.2069C59.7065 82.9089 39.9456 75.2504 24.7994 61.4352L4.58791 42.9999L24.7994 24.5646Z"
            fill="#D9D9D9"
            stroke="white"
            strokeWidth="6.18192"
          />
        </mask>
        <g mask="url(#mask0_665_1034)">
          <path
            d="M41.675 1.23094C55.3428 -16.5134 76.4723 -26.909 98.8703 -26.909C121.268 -26.909 142.398 -16.5134 156.066 1.23095L165.683 13.7167L156.066 26.2024C142.398 43.9467 121.268 54.3424 98.8703 54.3424C76.4723 54.3424 55.3428 43.9467 41.675 26.2024L32.0576 13.7167L41.675 1.23094Z"
            fill="#10135A"
            stroke="#10135A"
            strokeWidth="6.18192"
          />
          <path
            d="M24.7994 24.5646C39.9456 10.7494 59.7065 3.09085 80.2069 3.09085H117.796C138.296 3.09085 158.057 10.7494 173.203 24.5646L193.415 42.9999L173.203 61.4352C158.057 75.2504 138.296 82.9089 117.795 82.9089H80.2069C59.7065 82.9089 39.9456 75.2504 24.7994 61.4352L4.58791 42.9999L24.7994 24.5646Z"
            stroke="#10135A"
            strokeWidth="6.18192"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_665_1034">
          <rect width="99" height="86" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
