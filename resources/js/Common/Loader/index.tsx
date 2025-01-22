const Loader = () => {
    return (
        <div className="fixed w-full h-full top-0 left-0 z-[999999] bg-white flex items-center justify-center">
            <div className="loader w-10 h-10 rounded-full border-4 border-red-500 border-l-transparent animate-loader"></div>
        </div>
    );
};

export default Loader;
