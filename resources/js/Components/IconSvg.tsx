export const IconEye = ({ color = "white", size = 20, event = () => {} }) => (
    <svg
        width={size}
        height={size}
        fill='transparent'
        viewBox="0 0 95 71"
        xmlns="http://www.w3.org/2000/svg"
        onClick={event}
    >
        <path
            d="M23.5 11.5C35 1.16668 64.8 -8.49999 92 35.5C86.3333 45.6667 70.2 66.4 51 68C43.1667 70.1667 22.6 66.7 3 35.5L12 23"
            stroke={color}
            stroke-width="10"
            stroke-linecap="round"
        />
        <circle cx="47" cy="36" r="15" stroke={color} stroke-width="10" />
    </svg>
);

export const IconTrash = ({ color = "white", size = 20, event = () => {}  }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 85 93"
        fill='transparent'
        xmlns="http://www.w3.org/2000/svg"
        onClick={event}
    >
        <path
            d="M70.5 80L76 24H7.5C9.16667 38.8333 12.6 70.8 13 80C13.4 89.2 19.8333 90.8333 23 90.5C31.6667 90.3333 51.2 90.1 60 90.5C68.8 90.9 70.6667 83.6667 70.5 80Z"
            stroke={color}
            stroke-width="6"
            stroke-linecap="round"
        />
        <path
            d="M45.5 37.5C42.3 32.3 38.8333 35.3333 37.5 37.5V75C41.1 81.8 44.3333 77.8333 45.5 75V37.5Z"
            stroke={color}
            stroke-width="4"
            stroke-linecap="round"
        />
        <path
            d="M55.5 37.5L53.5 75C55.9 80.2 59.5 77.1667 61 75L63.5 37.5C60.3 32.3 56.8333 35.3333 55.5 37.5Z"
            stroke={color}
            stroke-width="4"
            stroke-linecap="round"
        />
        <path
            d="M35.5 9.00001C35.3333 6.83334 36.3 2.60001 41.5 3.00001C43.3333 3.00001 47 4.20001 47 9.00001M8.49999 16.5C7.66666 14.8333 6.89999 11.4 10.5 11H72.5C73.8333 11.5 76.2 13.3 75 16.5H8.49999Z"
            stroke={color}
            stroke-width="10"
            stroke-linecap="round"
        />
    </svg>
);

export const IconEdit = ({ color = "white", size = 20, event = () => {}  }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 96 97"
        width={size}
        height={size}
        fill='transparent'
        onClick={event}
    >
        <path
            d="M58 95H93"
            stroke={color}
            stroke-width="16"
            stroke-linecap="round"
        />
        <path
            d="M91 34.5L32.0825 91.9322C31.709 92.2962 31.2081 92.5 30.6865 92.5H4.5C3.39543 92.5 2.5 91.6046 2.5 90.5V65.8284C2.5 65.298 2.69847 64.8015 3.07356 64.4265C20.6248 46.8774 56.3785 11.2259 63.5 4.5C70.6003 -2.20583 80.5532 7.06966 84.8235 12.7623C84.9431 12.9218 85.0865 13.0637 85.2457 13.1838C97.3569 22.3192 94.1456 31.1889 91 34.5Z"
            stroke={color}
            stroke-width="8"
            stroke-linecap="round"
        />
    </svg>
);

export const IconPlus = ({ color = "white", size = 20 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
    >
        <title>plus-outline</title>
        <path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
    </svg>
);
