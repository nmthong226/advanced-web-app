import { SignIn } from "@clerk/clerk-react";
import carrousel from "/carrousel.jpg";
import illustrator_one from "/illustrator_one.png";
import illustrator_two from "/illustrator_two.png";
import illustrator_three from "/illustrator_three.png";

import logo from "/logo-1.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";


// Import style
import './style.css';
import { useEffect, useRef } from "react";

const SignInPage = () => {
  const prevRef = useRef<HTMLButtonElement>(null); // Reference for the Previous button
  const nextRef = useRef<HTMLButtonElement>(null); // Reference for the Next button

  const slides = [
    { image: illustrator_one, text: "Manage your time efficiently" },
    { image: illustrator_two, text: "Stay organized every day" },
    { image: illustrator_three, text: "Boost your productivity" },
  ];

  useEffect(() => {
    // Ensure Swiper attaches correctly to custom buttons
    if (prevRef.current && nextRef.current) {
      prevRef.current.classList.add("custom-prev");
      nextRef.current.classList.add("custom-next");
    }
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center bg-indigo-50 w-full h-screen">
      {/* Header */}
      <div className="top-0 left-1/2 absolute flex flex-col items-center p-4 transform -translate-x-1/2">
        <div className="flex">
          <img src={logo} className="mr-2 w-6 h-6" />
          <h1 className="font-semibold text-lg">Focus Flow</h1>
        </div>
        <hr className="border-[1px] border-indigo-200 my-1 w-64" />
        <span className="font-normal text-[12px]">
          Planner App - Manage your time efficiently
        </span>
      </div>
      {/* Main Container */}
      <div className="flex justify-end space-x-3 bg-gradient-to-b from-white to-indigo-200 p-2 border rounded-lg w-[730px] h-[472px]">
        <div className="flex w-[400px] h-full">
          <SignIn signUpUrl="/sign-up" />
        </div>
        {/* Carousel Section */}
        <div className="relative flex flex-col flex-1 justify-center items-center shadow-xl rounded-lg h-auto overflow-hidden group">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage: `url(${carrousel})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.3,
              zIndex: 0,
            }}
          />
          {/* Swiper Carousel */}
          <div className="relative z-20 flex justify-center items-center w-full h-full">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
              className="w-[280px] h-[420px]"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index} className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={slide.image}
                      alt={`Slide ${index}`}
                      className="rounded-lg w-52 h-52 object-contain"
                    />
                    <p className="font-semibold text-blue-900 text-center text-sm">
                      {slide.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Arrows */}
            <button className="top-1/2 left-2 z-50 absolute flex justify-center items-center bg-white opacity-0 group-hover:opacity-100 shadow custom-prev p-2 rounded-full w-6 h-6 text-gray-700 transform transition-opacity -translate-y-1/2">
              ❮
            </button>
            <button className="top-1/2 right-2 z-50 absolute flex justify-center items-center bg-white opacity-0 group-hover:opacity-100 shadow custom-next p-2 rounded-full w-6 h-6 text-gray-700 transform transition-opacity -translate-y-1/2">
              ❯
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bottom-1 left-1/2 absolute flex flex-col items-center space-y-1 p-4 transform -translate-x-1/2">
        <span className="font-semibold text-muted-foreground text-sm">
          &copy;{" "}
          <a
            href="https://github.com/huyk21"
            target="_blank"
            className="hover:text-indigo-700"
          >
            ldhuy
          </a>
          -
          <a
            href="https://github.com/quyhoaphantruong"
            target="_blank"
            className="hover:text-indigo-700"
          >
            ptqhoa
          </a>
          -
          <a
            href="https://github.com/nmthong226"
            target="_blank"
            className="hover:text-indigo-700"
          >
            nmthong
          </a>
        </span>
        <hr className="my-1 border w-64" />
        <p className="text-[12px] text-muted-foreground">
          Legal Notice
          <span className="mx-2">·</span>
          Privacy Policy
          <span className="mx-2">·</span>
          Terms of Service
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
