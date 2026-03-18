import Image from "next/image";

const DEFAULT_IMAGES = [
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
  "template/wedding/premium/film/cover.webp",
];

export default function CardGaleries({
  images = DEFAULT_IMAGES,
}: {
  images?: string[];
}) {
  return (
    <div className='flex items-center justify-center mt-12'>
      <div
        className='
          relative grid place-items-center w-[600px] h-[200px] sm:h-[400px]
          transform-[perspective(1000px)_rotateX(70deg)]
          transform-3d
          bg-[radial-gradient(circle_at_50%_50%,#222_30%,transparent_40%)]
          animate-[rotate_15s_linear_infinite]
          transition-all duration-1000
          hover:paused
          max-[992px]:scale-[.7]
        '>
        {images.map((v, i) => (
          <div
            key={i}
            className='
              absolute grid place-items-center w-[190px] h-[225px] bg-[#333]
              rounded-2xl shadow-[0_0_20px_rgba(0,0,0,.5)] 
            '
            style={{
              transform: `
                rotateZ(${(360 / images.length) * i}deg)
                rotateX(90deg)
                translateY(120px)
                translateZ(280px)
                rotateZ(180deg)
              `,
            }}>
            <Image
              src={`https://s3.nevaobjects.id/invitekit-bucket/${v}`}
              alt={`Image ${i + 1}`}
              fill
              className='object-cover rounded-2xl'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
