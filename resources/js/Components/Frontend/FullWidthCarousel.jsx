import { Box, Stack, Text, Image, AspectRatio } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();
const FullWidthCarousel = ({ slides, loop = true, pagination }) => {
    const swiperRef = useRef(null);

    const paginationBullet = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + "</span>";
        },
    };

    useEffect(() => {
        const swiperContainer = swiperRef.current;
        const params = {

            pagination: pagination ? paginationBullet : false,
            navigatioin: true,
            injectStyles: [
                `
                    .swiper, .carousel {
                        width: 100% !important;
                    }
                    .swiper-pagination-bullet {
                        width: 1rem !important;
                        height: 1rem !important;
                        text-align: center;
                        line-height: 1.2;
                        font-size: 12px;
                        opacity: 1;
                        background: rgba(0, 0, 0, 0.4);
                    }

                    .swiper-pagination-bullet-active {
                        background: var(--color-grey-lighter);
                    }
                    .swiper-button-prev {
                        left: 1rem !important;
                    }
                    .swiper-button-next {
                        right: 1rem !important;
                    }
                    .swiper-button-next,
                    .swiper-button-prev {
                        bottom: 50% !important;
                        background-color: transparent;
                        background-size: 1.5rem;
                        padding-inline: 8px;
                        border-radius: 5px;
                        border: 2px solid var(--color-light);
                        width: 2rem !important;
                        height: 2.75rem !important;
                        background: var(--chakra-colors-primary-400);
                    }
                    .swiper-button-next > svg ,
                    .swiper-button-prev > svg{
                        height: 1.5rem !important;
                        color: var(--color-light);
                    }
                `,
            ],
        };

        Object.assign(swiperContainer, params);
        swiperContainer.initialize();
    }, []);
    return (
        <swiper-container
            ref={swiperRef}
            init="true"
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            padingation
            navigation={true}
            lazy={true}
            keyboard={true}
            effect="fade"
            loop={loop}
            class="carousel"
        >
            {slides.map((slide) => (
                <swiper-slide key={slide.id}>
                    <Box
                        pos="relative"
                        _before={{
                            content: `''`,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: `100%`,
                            height: "100%",
                            background: "rgba(0,0,0,0.3)",
                            backgroundBlendMode: "multiply",
                        }}
                        h="100%"
                    >
                        <Image
                            src={`${slide.media[0].original_url}`}
                            alt={slide.title}
                            objectFit={"cover"}

                        />
                        <Stack
                            pos="absolute"
                            bottom="60px"
                            textAlign="center"
                            w="full"
                            color="whiteAlpha.800"
                            zIndex={1}
                            gap={2}
                            justify="center"
                            align="center"
                        >
                            <Text fontSize="3xl">{slide.title}</Text>
                            <Text fontSize="sm">{slide.subtitle}</Text>
                        </Stack>
                    </Box>
                </swiper-slide>
            ))}
        </swiper-container>
    );
};

export default FullWidthCarousel;
