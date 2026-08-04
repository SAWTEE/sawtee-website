import { cn } from '@/lib/utils';

export const Blob = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 578 440"
      className={className}
    >
      <title>Blob</title>
      <path
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </svg>
  );
};

export const FaxIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height="24px"
    width="24px"
    fill="currentColor"
    {...props}
  >
    <path d="M200-120q-50 0-85-35t-35-85v-280q0-50 35-85t85-35q27 0 49.5 11t39.5 29h31v-200h400v200h40q50 0 85 35t35 85v320H289q-17 18-39.5 29T200-120Zm0-80q17 0 28.5-11.5T240-240v-280q0-17-11.5-28.5T200-560q-17 0-28.5 11.5T160-520v280q0 17 11.5 28.5T200-200Zm200-400h240v-120H400v120Zm-80 360h480v-240q0-17-11.5-28.5T760-520H320v280Zm280-160q17 0 28.5-11.5T640-440q0-17-11.5-28.5T600-480q-17 0-28.5 11.5T560-440q0 17 11.5 28.5T600-400Zm120 0q17 0 28.5-11.5T760-440q0-17-11.5-28.5T720-480q-17 0-28.5 11.5T680-440q0 17 11.5 28.5T720-400ZM600-280q17 0 28.5-11.5T640-320q0-17-11.5-28.5T600-360q-17 0-28.5 11.5T560-320q0 17 11.5 28.5T600-280Zm120 0q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280Zm-360 0h160v-200H360v200Zm-40 40v-280 280Z" />
  </svg>
);

export const LocationPin = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height="24px"
    width="24px"
    fill="currentColor"
    {...props}
  >
    <path d="M2 5L9 2L15 5L21.303 2.2987C21.5569 2.18992 21.8508 2.30749 21.9596 2.56131C21.9862 2.62355 22 2.69056 22 2.75827V19L15 22L9 19L2.69696 21.7013C2.44314 21.8101 2.14921 21.6925 2.04043 21.4387C2.01375 21.3765 2 21.3094 2 21.2417V5ZM16 19.3955L20 17.6812V5.03308L16 6.74736V19.3955ZM14 19.2639V6.73607L10 4.73607V17.2639L14 19.2639ZM8 17.2526V4.60451L4 6.31879V18.9669L8 17.2526Z" />
  </svg>
);

export const EmailIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height="24px"
    width="24px"
    fill="currentColor"
    {...props}
  >
    <path d="M2 5.5V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5ZM0 10H5V12H0V10ZM0 15H8V17H0V15Z" />
  </svg>
);

export const TwitterIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
    >
      <title>Twitter Logo</title>
      <g id="Social Media">
        <path
          id="Vector"
          d="M11.3214 8.93666L16.4919 3.05566H15.2667L10.7772 8.16205L7.1914 3.05566H3.05566L8.47803 10.7774L3.05566 16.9446H4.28097L9.022 11.552L12.8088 16.9446H16.9446L11.3211 8.93666H11.3214ZM9.64322 10.8455L9.09382 10.0765L4.72246 3.95821H6.60445L10.1322 8.8959L10.6816 9.66481L15.2672 16.083H13.3852L9.64322 10.8458V10.8455Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const YoutubeIcon = () => {
  return (
    <svg
      className="h-[0.875rem] w-[1.25rem] text-white"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Youtube Logo</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9346 1.13529C14.5684 1.30645 15.0665 1.80588 15.2349 2.43896C15.5413 3.58788 15.5413 5.98654 15.5413 5.98654C15.5413 5.98654 15.5413 8.3852 15.2349 9.53412C15.0642 10.1695 14.5661 10.669 13.9346 10.8378C12.7886 11.1449 8.19058 11.1449 8.19058 11.1449C8.19058 11.1449 3.59491 11.1449 2.44657 10.8378C1.81277 10.6666 1.31461 10.1672 1.14622 9.53412C0.839844 8.3852 0.839844 5.98654 0.839844 5.98654C0.839844 5.98654 0.839844 3.58788 1.14622 2.43896C1.31695 1.80353 1.81511 1.30411 2.44657 1.13529C3.59491 0.828125 8.19058 0.828125 8.19058 0.828125C8.19058 0.828125 12.7886 0.828125 13.9346 1.13529ZM10.541 5.98654L6.72178 8.19762V3.77545L10.541 5.98654Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const FacebookIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
    >
      <title>Facebook Logo</title>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 9H17.5L17 11H13V20H11V11H7V9H11V7.12777C11 5.34473 11.1857 4.69816 11.5343 4.04631C11.8829 3.39446 12.3945 2.88288 13.0463 2.53427C13.6982 2.18565 14.3447 2 16.1278 2C16.6498 2 17.1072 2.05 17.5 2.15V4H16.1278C14.8041 4 14.401 4.07784 13.9895 4.29789C13.6862 4.46011 13.4601 4.68619 13.2979 4.98951C13.0778 5.40096 13 5.80407 13 7.12777V9Z"
      />
    </svg>
  );
};

export const LinkedinIcon = ({ className }) => {
  return (
    <svg
      className={cn('h-[1rem] w-[1rem] text-white', className)}
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>LinkedIn Logo</title>
      <path
        d="M2.8794 11.5527V3.86835H0.318893V11.5527H2.87967H2.8794ZM1.59968 2.81936C2.4924 2.81936 3.04817 2.2293 3.04817 1.49188C3.03146 0.737661 2.4924 0.164062 1.61666 0.164062C0.74032 0.164062 0.167969 0.737661 0.167969 1.49181C0.167969 2.22923 0.723543 2.8193 1.5829 2.8193H1.59948L1.59968 2.81936ZM4.29668 11.5527H6.85698V7.26187C6.85698 7.03251 6.87369 6.80255 6.94134 6.63873C7.12635 6.17968 7.54764 5.70449 8.25514 5.70449C9.18141 5.70449 9.55217 6.4091 9.55217 7.44222V11.5527H12.1124V7.14672C12.1124 4.78652 10.8494 3.68819 9.16483 3.68819C7.78372 3.68819 7.17715 4.45822 6.84014 4.98267H6.85718V3.86862H4.29681C4.33023 4.5895 4.29661 11.553 4.29661 11.553L4.29668 11.5527Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const MailBoxIcon = props => (
  <svg
    className="h-6 w-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"
    />
  </svg>
);

export const ToggleIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M8 7C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H16C18.7614 17 21 14.7614 21 12C21 9.23858 18.7614 7 16 7H8ZM8 5H16C19.866 5 23 8.13401 23 12C23 15.866 19.866 19 16 19H8C4.13401 19 1 15.866 1 12C1 8.13401 4.13401 5 8 5ZM8 15C6.34315 15 5 13.6569 5 12C5 10.3431 6.34315 9 8 9C9.65685 9 11 10.3431 11 12C11 13.6569 9.65685 15 8 15Z"></path>
  </svg>
);

export const HomeIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="svg-icon"
    width="24px"
    height="24px"
    role="img"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
    />
  </svg>
);

export const PhoneOutlineIcon = props => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5.693 16.013H7.31a1.685 1.685 0 0 0 1.685-1.684v-.645A1.684 1.684 0 0 1 10.679 12h2.647a1.686 1.686 0 0 1 1.686 1.686v.646c0 .446.178.875.494 1.19.316.317.693.495 1.14.495h1.685a1.556 1.556 0 0 0 1.597-1.016c.078-.214.107-.776.088-1.002.014-4.415-3.571-6.003-8-6.004-4.427 0-8.014 1.585-8.01 5.996-.02.227.009.79.087 1.003a1.558 1.558 0 0 0 1.6 1.02Z"
    />
  </svg>
);

export const CircleIcon = props => (
  <svg viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </svg>
);
