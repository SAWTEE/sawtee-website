import { Image, Box, LinkBox, Skeleton, Text } from "@chakra-ui/react";
import InertiaChakraLinkOverlay from "./styles/inertia-chakra-link-overlay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import { Link } from "@inertiajs/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import InertiaChakraLink from "./styles/inertia-chakra-link";

const MultiItemCarousel = ({
    slides,
    className,
    itemsToShow = 3,
    showTitle = false,
    spacing = 30,
    children,
    ...rest
}) => {
    return (
        <Swiper
            slidesPerView={itemsToShow}
            spaceBetween={spacing}
            navigation={true}
            slidesPerGroup={itemsToShow}
            keyboard={true}
            modules={[Navigation, Pagination, Keyboard]}
            className={"multi-item-carousel " + className}
        >
            {children}
            {slides.length >= 1 &&
                slides.map((slide) => {
                    return (
                        <SwiperSlide
                            className="swiper-slide"
                            maxW={{ base: "180px", md: "180px", lg: "220px" }}
                            key={slide.id}
                        >
                            <LinkBox
                                as="article"
                                maxW={{
                                    base: "180px",
                                    md: "180px",
                                    lg: "220px",
                                }}
                                mx="auto"
                                _before={{
                                    content: `''`,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: `100%`,
                                    height: "100%",
                                    borderRadius: "var(--chakra-radii-md)",
                                    background: "rgba(0,0,0,0.1)",
                                    backgroundBlendMode: "overlay",
                                }}
                                _hover={{
                                    _before: {
                                        background: "transparent",
                                    },
                                }}
                                {...rest}
                            >
                                <InertiaChakraLinkOverlay
                                    title={slide.title}
                                    href={
                                        slide.file
                                            ? `/publications/${slide.file.name}`
                                            : "#"
                                    }
                                    target="_blank"
                                >
                                    <Image
                                        src={`${slide.media[0]?.original_url}`}
                                        alt={slide.title}
                                        title={slide.title}
                                        rounded="md"
                                        objectFit="cover"
                                        w={{
                                            base: "180px",
                                            md: "180px",
                                            lg: "220px",
                                        }}
                                        fallbackSrc="/assets/SM-placeholder-150x150.png"
                                        aspectRatio={3 / 4}
                                    />
                                </InertiaChakraLinkOverlay>
                            </LinkBox>
                            {showTitle && slide.title && (
                                <InertiaChakraLink
                                    href={`/publications/${slide.file.name}`}
                                >
                                    <Text
                                        mt={4}
                                        fontSize="sm"
                                        fontWeight="semibold"
                                        textAlign="center"
                                    >
                                        {slide.title}
                                    </Text>
                                    {slide.subtitle && (
                                        <Text
                                            mt={1}
                                            fontSize="xs"
                                            textAlign="center"
                                        >
                                            {slide.subtitle}
                                        </Text>
                                    )}
                                </InertiaChakraLink>
                            )}
                        </SwiperSlide>
                    );
                })}
            {slides.length <= 0 &&
                [1, 2, 3, 4, 5, 6].map((item) => (
                    <SwiperSlide className="swiper-slide" key={`${item}+1`}>
                        <Box {...rest} cursor="pointer">
                            <Skeleton
                                rounded="md"
                                startColor="gray.300"
                                endColor="gray.400"
                                w={{ base: "180px", md: "180px", lg: "240px" }}
                                aspectRatio={3 / 4}
                                // h={{ base: "200px", lg: "320px" }}
                                mx="auto"
                            />
                        </Box>
                    </SwiperSlide>
                ))}
        </Swiper>
    );
};

export default MultiItemCarousel;
