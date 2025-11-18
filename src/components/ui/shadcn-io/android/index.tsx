"use client";
import { SVGProps, ReactNode } from "react";

export interface AndroidProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
  children?: ReactNode;
}

export const Android = ({
  width = 433,
  height = 882,
  src,
  videoSrc,
  children,
  ...props
}: AndroidProps) => {
  const innerW = 360;
  const innerH = 800;
  const offsetX = 36.5;
  const offsetY = 41;
  const rx = 33;
  const ry = 33;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 433 882"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Botão lateral direito - volume/power */}
      <path
        d="M376 153H378C379.105 153 380 153.895 380 155V249C380 250.105 379.105 251 378 251H376V153Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M376 301H378C379.105 301 380 301.895 380 303V351C380 352.105 379.105 353 378 353H376V301Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      
      {/* Frame externo do celular */}
      <path
        d="M0 42C0 18.8041 18.804 0 42 0H336C359.196 0 378 18.804 378 42V788C378 811.196 359.196 830 336 830H42C18.804 830 0 811.196 0 788V42Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      
      {/* Frame interno branco */}
      <path
        d="M2 43C2 22.0132 19.0132 5 40 5H338C358.987 5 376 22.0132 376 43V787C376 807.987 358.987 825 338 825H40C19.0132 825 2 807.987 2 787V43Z"
        className="fill-white dark:fill-[#262626]"
      />
      
      {/* Área da tela com clip */}
      <g clipPath="url(#android-clip)">
        <rect
          x={offsetX}
          y={offsetY}
          width={innerW}
          height={innerH}
          rx={rx}
          ry={ry}
          className="fill-[#E5E5E5] dark:fill-[#404040]"
        />
      </g>
      
      {/* Câmera frontal */}
      <circle
        cx="189"
        cy="28"
        r="9"
        className="fill-white dark:fill-[#262626]"
      />
      <circle
        cx="189"
        cy="28"
        r="4"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      
      {/* Conteúdo - imagem */}
      {src && (
        <image
          href={src}
          x={offsetX}
          y={offsetY}
          width={innerW}
          height={innerH}
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#android-clip)"
        />
      )}
      
      {/* Conteúdo - vídeo */}
      {videoSrc && (
        <foreignObject
          x={offsetX}
          y={offsetY}
          width={innerW}
          height={innerH}
          clipPath="url(#android-clip)"
        >
          <video
            className="w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </foreignObject>
      )}
      
      {/* Conteúdo - children (React components) */}
      {children && (
        <foreignObject
          x={offsetX}
          y={offsetY}
          width={innerW}
          height={innerH}
          clipPath="url(#android-clip)"
        >
          <div 
            className="w-full h-full overflow-hidden"
            style={{ width: innerW, height: innerH }}
          >
            {children}
          </div>
        </foreignObject>
      )}
      
      {/* Definições de clip path */}
      <defs>
        <clipPath id="android-clip">
          <rect
            x={offsetX}
            y={offsetY}
            width={innerW}
            height={innerH}
            rx={rx}
            ry={ry}
          />
        </clipPath>
      </defs>
    </svg>
  );
};