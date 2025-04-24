import { FC } from 'react';

import { IconProps } from '~/shared/icons/Game/Game.tsx';

export const Coin: FC<IconProps> = ({ width = 74, height = 74 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 74 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="36.9989" cy="36.9998" r="37.0018" fill="#F9E160" />
      <g filter="url(#filter0_i_0_2167)">
        <circle
          cx="36.9998"
          cy="36.9998"
          r="30.7303"
          fill="#FE881C"
          fillOpacity="0.72"
        />
      </g>
      <g filter="url(#filter1_d_0_2167)">
        <path
          d="M35.5799 57.6965V53.5347C31.1048 53.1956 27.6058 51.5926 25.083 48.7255L28.0113 44.5637C30.0837 46.845 32.6065 48.2169 35.5799 48.6793V39.7545C34.1683 39.3846 32.997 39.0301 32.0659 38.691C31.1349 38.321 30.1588 37.8124 29.1376 37.165C28.1164 36.4867 27.3355 35.6236 26.7949 34.5754C26.2843 33.4964 26.0291 32.2324 26.0291 30.7835C26.0291 28.4098 26.9 26.3905 28.642 24.7258C30.384 23.0611 32.6966 22.1054 35.5799 21.8588V17.5582H39.184V21.905C42.8182 22.3058 45.8366 23.693 48.2393 26.0668L45.2209 30.0899C43.569 28.4252 41.5567 27.3462 39.184 26.8529V34.8066C40.2953 35.1149 41.2414 35.4078 42.0223 35.6852C42.8031 35.9627 43.6591 36.3634 44.5902 36.8875C45.5513 37.3808 46.3171 37.9357 46.8878 38.5522C47.4584 39.138 47.939 39.9087 48.3294 40.8643C48.7199 41.82 48.9151 42.899 48.9151 44.1013C48.9151 46.6292 48.0892 48.7718 46.4373 50.529C44.8154 52.2554 42.3977 53.2573 39.184 53.5347V57.6965H35.5799ZM42.4728 47.1995C43.1936 46.4288 43.554 45.5656 43.554 44.61C43.554 43.6543 43.1786 42.8836 42.4277 42.2979C41.6769 41.6813 40.5956 41.1572 39.184 40.7256V48.7255C40.6557 48.4789 41.7519 47.9702 42.4728 47.1995ZM31.4352 30.4136C31.4352 31.8933 32.8168 33.034 35.5799 33.8355V26.6217C34.2885 26.745 33.2673 27.1612 32.5164 27.8703C31.7956 28.5485 31.4352 29.3963 31.4352 30.4136Z"
          fill="#FFEA7C"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_0_2167"
          x="6.26947"
          y="6.26953"
          width="61.4606"
          height="62.1725"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="0.711864"
            operator="erode"
            in="SourceAlpha"
            result="effect1_innerShadow_0_2167"
          />
          <feOffset dy="0.711864" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_0_2167"
          />
        </filter>
        <filter
          id="filter1_d_0_2167"
          x="25.083"
          y="17.5582"
          width="23.8321"
          height="40.8502"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.711864" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_0_2167"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_0_2167"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
