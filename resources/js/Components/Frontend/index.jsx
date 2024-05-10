import { default as ChakraLink, default as InertiaChakraLink } from "@/Components/Frontend/styles/inertia-chakra-link";
import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Icon,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    createIcon,
    useColorModeValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { HiArrowRight, HiChevronDown, HiChevronRight } from "react-icons/hi";

// A debounced input react component
export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export const PlayIcon = createIcon({
    displayName: "PlayIcon",
    viewBox: "0 0 58 58",
    d: "M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z",
});

export const Blob = (props) => {
    return (
        <Icon
            width={"100%"}
            viewBox="0 0 578 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
                fill="currentColor"
            />
        </Icon>
    );
};

export const Content = styled(Box)`
    word-break: break-word;
    font-size: var(--chakra-fontSizes-md);
    white-space: collapse balance;

    line-height: var(--chakra-lineHeights-taller);

    p {
        padding-block: 10px;
        font-size: 18px;
        line-height: var(--chakra-lineHeights-tall);
    }

    * {
        max-width: 100%;
    }

    ul,
    ol {
        padding: 0;
        margin-left: 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        overflow-wrap: break-word;
        word-break: break-word;
    }

    h1 {
        font-size: var(--chakra-fontSizes-4xl);
        margin-block: 35px;
    }

    h2 {
        font-size: var(--chakra-fontSizes-3xl);
        margin-block: 30px;
    }

    h3 {
        font-size: var(--chakra-fontSizes-2xl);
        margin-block: 25px;
    }

    h4 {
        font-size: var(--chakra-fontSizes-xl);
        margin-block: 20px;
    }

    h5 {
        font-size: var(--chakra-fontSizes-lg);
        margin-block: 15px;
    }

    h6 {
        font-size: var(--chakra-fontSizes-md);
        margin-block: 10px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    figure {
        margin: 24px auto;
        /* next line overrides an inline style of the figure element. */
        width: 100% !important;
    }

    iframe {
        display: block;
        margin: auto;
    }


`;

export const GlassBox = ({ children, ...rest }) => {
    return (
        <Box
            border="1px solid"
            borderColor={useColorModeValue("#ebebeb", "#333")}
            rounded="md"
            shadow="md"
            w="full"
            bg="var(--color-bg)"
            {...rest}
        >
            {children}
        </Box>
    );
};

export const Accordian = ({ data }) => {
    const [accordianData, setAccordianData] = useState([...data]);

    const ChangeAccordianOpenState = (id, open) => {
        const newState = accordianData.map((obj) => {
            // 👇️ if id equals 2d, update open property
            if (obj.open === true) {
                return { ...obj, open: false };
            }
            if (obj.id === id) {
                return { ...obj, open: !open };
            }

            // 👇️ otherwise return object as is
            return obj;
        });

        setAccordianData(newState);
    };

    function createMarkup(content) {
        return { __html: `${content}` };
    }

    return (
        <Wrapper>
            {accordianData.map(({ name, content, id, open }) => {
                return (
                    <li
                        key={id}
                        onClick={() => ChangeAccordianOpenState(id, open)}
                    >
                        <div className="accordian-item">
                            <p>{name}</p>
                            {open ? (
                                <HiChevronDown size={"3rem"} />
                            ) : (
                                <HiChevronRight size={"3rem"} />
                            )}
                        </div>
                        {open ? (
                            <div className="accordian-content">
                                <p
                                    dangerouslySetInnerHTML={createMarkup(
                                        content
                                    )}
                                />
                            </div>
                        ) : null}
                    </li>
                );
            })}
        </Wrapper>
    );
};

export const FancyTitle = ({ title, ...rest }) => {
    return (
        <HStack
            position="relative"
            justify={"space-evenly"}
            padding="10"
            mb="6"
            gap="4"
            {...rest}
        >
            <Divider h="2px" bg="gray.800" _dark={{ bg: "whiteAlpha.800" }} />
            <Box
                bg="blackAlpha.800"
                color="whiteAlpha.900"
                _dark={{ bg: "whiteAlpha.800", color: "gray.800" }}
                px="4"
                py="2"
                shadow="xl"
            >
                <Heading
                    as="h3"
                    fontSize={{ base: "xl", md: "2xl", lg: "4xl" }}
                    fontWeight="bold"
                    textAlign="center"
                    w="max-content"
                >
                    {title}
                </Heading>
            </Box>

            <Divider h="2px" bg="gray.800" _dark={{ bg: "whiteAlpha.800" }} />
        </HStack>
    );
};

export const MapModel = ({ isOpen, onClose, mapLink }) => {
    const modalContentColor = useColorModeValue(
        "rgba(255, 255, 255, 0.7)",
        "rgba(0, 0, 0, 0.7)"
    );
    const modelHeaderColor = useColorModeValue("gray.700", "whiteAlpha.900");
    return (
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset="slideInBottom"
            closeOnOverlayClick={true}
            scrollBehavior="inside"
            size={"xl"}
        >
            <ModalOverlay />
            <ModalContent bg={modalContentColor}>
                <ModalHeader color={modelHeaderColor}>Our Location</ModalHeader>
                <ModalCloseButton />
                <ModalBody margin={"0 auto"}>
                    <Image
                        objectFit={"cover"}
                        src={"/assets/location-map-resized.webp"}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button
                        as={ChakraLink}
                        size="sm"
                        variant="solid"
                        colorScheme={"primary"}
                        href="https://goo.gl/maps/fwZuwNSbjN5jwZia7"
                        target="_blank"
                        onClick={onClose}
                    >
                        Open in Google Map
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const Title = ({ text, color, ...rest }) => {
    return (
        <Text
            as="h3"
            fontFamily="heading"
            color={
                color ? color : useColorModeValue("gray.800", "whiteAlpha.800")
            }
            {...rest}
        >
            {text}
        </Text>
    );
};

export const ExploreButton = ({ text = "Explore All", ...rest }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Button
            variant="solid"
            colorScheme={"primary"}
            aria-label="view all"
            onMouseEnter={() => setHovered(!hovered)}
            onMouseLeave={() => setHovered(!hovered)}
            rightIcon={hovered ? <HiArrowRight /> : <HiChevronRight />}
            maxW="md"
            fontFamily={"body"}
            fontWeight={"semibold"}
            {...rest}
        >
            {text}
        </Button>
    );
};

export const StyledLink = styled(Link)`
    position: relative;
    text-decoration: none;
    font-size: ${(props) =>
        props.fontSize ? props.fontSize : "var(--chakra-fontSizes-sm)"};
    color: ${(props) => (props.color ? props.color : "inherit")};

    &::after {
        content: "";
        width: 0%;
        height: 2px;
        position: absolute;
        bottom: 1;
        left: 0;
        margin: 0;

        background: ${(props) => (props.color ? props.color : "#fff")};
        opacity: 0;
        transition: all 0.5s ease;
    }

    &:hover {
        text-decoration: none;
        &::after {
            width: 100%;
            opacity: 1;
        }
    }
`;

export const StyledChakraLink = styled(InertiaChakraLink)`
    position: relative;
    text-decoration: none;
    font-family: ${(props) =>
        props.fontFamily
            ? `var(--chakra-fonts-${props.fontFamily})`
            : "var(--chakra-fonts-body)"};
    font-size: ${(props) =>
        props.fontSize
            ? `var(--chakra-fontSizes-${props.fontSize})`
            : "var(--chakra-fontSizes-md)"};
    color: ${(props) =>
        props.color ? props.color : "var(--chakra-colors-gray-700)"};

    &::after {
        content: "";
        width: 0%;
        height: 2px;
        position: absolute;
        bottom: -2px;
        left: 0;
        margin: 0;

        background: ${(props) => (props.color ? props.color : "#fff")};
        opacity: 0;
        transition: all 0.5s ease;
    }

    &:hover {
        text-decoration: none;

        &::after {
            width: 100%;
            opacity: 1;
        }
    }
`;
