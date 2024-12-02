import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react";



const Slider = () => {
    const [width, setWidth] = useState();
    const carosel = useRef();
    useEffect(() => {
        setWidth(carosel.current.scrollWidth - carosel.current.offsetWidth)
    }, [])

    return (
        <div>
            <motion.div whileTap={{ cursor: "grabbing" }} ref={carosel} className="carosel">
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    className="inner-carosel">
                    <motion.div className="item">
                        <div className="relative flex items-center ">
                            <img src="https://i.ibb.co/pZ4Bzm8/re5.jpg" alt="" />
                            <div className="absolute h-full flex items-center justify-center backdrop-opacity-10 bg-black/50 rounded-[30px] top-0 w-full text-center">
                                <h2 className="text-xl text-white max-w-96">Saving one pet wont change the world, but for that one pet, the world will change.</h2>
                            </div>
                        </div>

                    </motion.div>
                    <motion.div className="item">
                        <div className="relative flex items-center ">
                            <img src="https://i.ibb.co/Rcz9BqX/re2.jpg" alt="" />
                            <div className="absolute h-full flex items-center justify-center backdrop-opacity-10 bg-black/50 rounded-[30px] top-0 w-full text-center">
                                <h2 className="text-xl text-white max-w-96">The greatness of a nation can be judged by the way its animals are treated. - Mahatma Gandhi</h2>
                            </div>
                        </div>

                    </motion.div>
                    <motion.div className="item">
                        <div className="relative flex items-center ">
                            <img src="https://i.ibb.co/Hh5wcfd/re3.jpg" alt="" />
                            <div className="absolute h-full flex items-center justify-center backdrop-opacity-10 bg-black/50 rounded-[30px] top-0 w-full text-center">
                                <h2 className="text-xl text-white max-w-96">Until one has loved an animal, a part of one`s soul remains unawakened. - Anatole France</h2>
                            </div>
                        </div>

                    </motion.div>
                    <motion.div className="item">
                        <div className="relative flex items-center ">
                            <img src="https://i.ibb.co/809gTkS/re4.jpg" alt="" />
                            <div className="absolute h-full flex items-center justify-center backdrop-opacity-10 bg-black/50 rounded-[30px] top-0 w-full text-center">
                                <h2 className="text-xl text-white max-w-96">The world would be a nicer place if everyone had the ability to love as unconditionally as a dog. - M.K. Clinton</h2>
                            </div>
                        </div>

                    </motion.div>
                    <motion.div className="item">
                        <div className="relative flex items-center ">
                            <img src="https://i.ibb.co/Fxk3xPh/re1.jpg" alt="" />
                            <div className="absolute h-full flex items-center justify-center backdrop-opacity-10 bg-black/50 rounded-[30px] top-0 w-full text-center">
                                <h2 className="text-xl text-white max-w-96">Pets are humanizing. They remind us we have an obligation and responsibility to preserve and nurture and care for all life. - James Cromwell</h2>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Slider;