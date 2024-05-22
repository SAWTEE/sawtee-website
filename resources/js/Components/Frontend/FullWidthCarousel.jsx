import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Box,
    Stack,
    Text,
    Image,
    Heading,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "./Swiper";

const FullWidthCarousel = ({
    slides,
    pagination = true,
    navigation,
    loop = true,
}) => {
    React.useEffect(() => {
        const swiperEl = document.getElementById("full-width-carousel");
        const prevButtonEl = document.getElementById("prev-button");
        const nextButtonEl = document.getElementById("next-button");

        prevButtonEl.addEventListener("click", () => {
            swiperEl.swiper.slidePrev();
        });

        nextButtonEl.addEventListener("click", () => {
            swiperEl.swiper.slideNext();
        });
    }, []);
    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={pagination}
            navigation={navigation}
            centeredSlides={true}
            autoplay={true}
            effect="fade"
            loop={loop}
            className="full-width-carousel"
            id="full-width-carousel"
        >
            <div slot="container-start">
                <Box
                    position="absolute"
                    top="50%"
                    inset={0}
                    transform="translateY( 45%)"
                    w={"full"}
                    zIndex={100}
                >
                    <IconButton
                        position="absolute"
                        colorScheme="blackAlpha"
                        color={"white"}
                        id="prev-button"
                        icon={<ChevronLeftIcon w="8" h="8" />}
                        aria-label="previous"
                        left="10"
                    />

                    <IconButton
                        position="absolute"
                        id="next-button"
                        colorScheme="blackAlpha"
                        color={"white"}
                        aria-label="next"
                        icon={<ChevronRightIcon w="8" h="8" />}
                        right="10"
                    />
                </Box>
            </div>
            {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                    <Image
                        src={`${slide.media[0].original_url}`}
                        alt={slide.title}
                        mixBlendMode="overlay"
                        boxSize="full"
                        backgroundSize="cover"
                    />

                    <Stack
                        spacing={4}
                        w={"full"}
                        maxW={"lg"}
                        position="absolute"
                        justify="center"
                        alignItems="center"
                        color="white"
                    >
                        <Heading
                            fontSize={{
                                base: "3xl",
                                md: "4xl",
                                lg: "5xl",
                            }}
                        >
                            {slide.title}
                        </Heading>
                        <Text fontSize={{ base: "md", lg: "lg" }}>
                            {slide.subtitle}
                        </Text>
                    </Stack>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FullWidthCarousel;
