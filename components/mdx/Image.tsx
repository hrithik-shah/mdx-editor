import Image from "next/image";

export const MdxImage = ({
  className = '',
  img,
  alt,
  width = 800,
  height = 800
}: {
  className?: string;
  img: any;
  alt: string;
  width?: number;
  height?: number;
}) => {
  const isExternalUrl = typeof img === 'string' && img.startsWith('https://');

  return (
    <div className={`flex w-full justify-center ${className}`}>
      <Image 
        src={img || "https://pixnio.com/free-images/2017/09/26/2017-09-26-07-22-55.jpg"}
        width={width} 
        height={height} 
        alt={alt}
        unoptimized={isExternalUrl}
      />
    </div>
  );
};