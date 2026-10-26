import Image from "next/image";
import "./touch-grass-print.css";

/** A pasted botanical field note breaking out of the profile's tidy grid. */
export default function TouchGrassPrint() {
  return (
    <figure className="touch-grass-print">
      <div className="touch-grass-print__paper">
        <Image
          src="/about-touch-grass.png"
          alt='Grainy botanical X-ray poster of a peony and butterfly with electric blue scan windows, technical annotations, and the words “touch grass”.'
          width={1122}
          height={1402}
          sizes="(min-width: 1280px) 230px, (min-width: 640px) 120px, 110px"
          className="touch-grass-print__image"
        />
      </div>
    </figure>
  );
}
