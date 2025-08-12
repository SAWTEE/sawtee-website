export default function LogoCarousel({ logos }) {
  return (
    <div className="group inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="group-hover:animation-pause flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {logos.map((logo, index) => (
          <li key={logo.alt + `${index}`} title={logo.alt}>
            <a href={logo.link} target="_blank" className="">
              <img
                src={logo.src}
                alt={logo.alt}
                className="mx-4 inline h-16"
              />
            </a>
          </li>
        ))}
      </ul>
      <ul className="group-hover:animation-pause flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
        {logos.map((logo, index) => (
          <li key={logo.alt + `${index}`} title={logo.alt}>
            <a href={logo.link} target="_blank" className="">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-full"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
