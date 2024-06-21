import Image from 'next/legacy/image';
import { cn, getRandomInteger } from '@/lib/utils';
import Cat1 from '@/public/carousal/cat1.webp';
import Cat2 from '@/public/carousal/cat2.webp';
import Cat3 from '@/public/carousal/cat3.webp';
import { StyleAttributes } from './types';

type Props = {
  direction: 'up' | 'down';
};

const images = [
  { src: Cat1, alt: 'Cat1' },
  { src: Cat2, alt: 'Cat2' },
  { src: Cat3, alt: 'Cat3' },
];

const aspectRatioList = ['3/4', '4/3', '9/16', '1/1'];

const imagesRatio = images.map(
  (_, index) => aspectRatioList[getRandomInteger(0, aspectRatioList.length)]
);

export function Carousel({ direction }: Props) {
  const listStyle: StyleAttributes<HTMLUListElement> = {
    className: cn('grid', {
      'animate-infinite-scroll-up': direction === 'up',
      'animate-infinite-scroll-down': direction === 'down',
    }),
  };

  const getItemStyle = (index: number): StyleAttributes<HTMLLIElement> => ({
    className: cn('relative my-2 w-full overflow-hidden rounded-3xl'),
    style: { aspectRatio: imagesRatio[index] },
  });

  return (
    <div
      className={cn(
        'overflow-hidden [mask-image:_linear-gradient(to_bottom,transparent_0,_black_200px,_black_calc(100%-200px),transparent_100%)]'
      )}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <ul key={index} {...listStyle} aria-hidden={index !== 0}>
          {images.map((logo, index) => (
            <li key={index} {...getItemStyle(index)}>
              <Image
                src={logo.src}
                alt={logo.alt}
                objectFit='cover'
                layout='fill'
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function DualDirectionCarousel() {
  return (
    <div className='grid grid-flow-col grid-cols-1 gap-4 overflow-hidden xl:grid-cols-2'>
      <Carousel direction='down' />
      <Carousel direction='up' />
    </div>
  );
}
