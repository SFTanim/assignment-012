


const Banner = () => {
    return (
        <div className="relative">
            <div className="rounded-lg">
                <img className="rounded-lg min-h-96" src="https://pawpals-demo.pbminfotech.com/demo3/wp-content/uploads/sites/4/2024/05/titlebar-bg.jpg" alt="" />
            </div>
            <div className="absolute top-1/4 left-4 ">
                <h2 className="text-2xl lg:text-6xl text-white font-bold pb-5 border-b-2">Make Your Pet <br /> Feel Like Home</h2>
                <p className="my-3 text-white max-w-80 lg:max-w-md">We are fully committed to the health & hygiene of your furry best friends</p>
                <button className="commonly-used-button2">Contact us</button>
            </div>
        </div>
    );
};

export default Banner;