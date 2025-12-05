import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const PythonIcon = (props: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.589 3 7.589 3L7.56 5.989s-.027 1.264 1.28 1.264h3.203v.9H7.045s-3.44-.36-3.44 4.692c0 4.704 2.366 4.523 2.366 4.523h1.41v-1.983s-.08-2.366 2.324-2.366v-.002h-.12v.675zm-.52-6.135a.744.744 0 1 1 0-1.488.744.744 0 0 1 0 1.488z"
        fill="currentColor"
      />
      <path
        d="M14.415 12.308h-4.328s-2.432-.039-2.432 2.35v3.951S7.286 21 12.064 21c4.574 0 4.347 0 4.347 0l.029-2.989s.027-1.264-1.28-1.264h-3.203v-.9h5.998s3.44.36 3.44-4.692c0-4.704-2.366-4.523-2.366-4.523h-1.41v1.983s.08 2.366-2.324 2.366v.002h.12v-.675zm.52 6.135a.744.744 0 1 1 0 1.488.744.744 0 0 1 0-1.488z"
        fill="currentColor"
      />
    </svg>
  );
};

const RCodeIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M9 9h3.5c1.1 0 2 .9 2 2s-.9 2-2 2H11v2m1.5-4L15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const JavaCodeIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.5 18c-1.5.5-1 1.5.5 1.5 3 0 7.5-.5 7.5-3.5M10 15c-1.5.5-1 1.5.5 1.5 2.5 0 6-.5 6-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 11c1.5-2 .5-4-1.5-4-2 0-3 1-3 3s1 3 3 3 3-1 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 6c.5-1.5 2-2.5 3.5-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CSharpIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M15 9.5c-1.5-1-3.5-1-5 0-1.5 1-1.5 3.5 0 4.5 1.5 1 3.5 1 5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 10v4M18 10v4M15 12h4M15 11h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const JuliaCodeIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="6" r="2.5" fill="currentColor" />
      <circle cx="7" cy="15" r="2.5" fill="currentColor" />
      <circle cx="17" cy="15" r="2.5" fill="currentColor" />
    </svg>
  );
};

const JupyterIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
    </svg>
  );
};

const TensorFlowIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3L4 7.5v9L12 21l8-4.5v-9L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 3v18M4 7.5l8 4.5 8-4.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const MlrIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M7 15V9l2 3 2-3 2 3 2-3v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RubyIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 6l3 6-3 6-3-6 3-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export {
  PythonIcon,
  RCodeIcon,
  JavaCodeIcon,
  CSharpIcon,
  JuliaCodeIcon,
  JupyterIcon,
  TensorFlowIcon,
  MlrIcon,
  RubyIcon,
};
