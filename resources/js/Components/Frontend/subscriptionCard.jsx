import React from "react";
import styled from "@emotion/styled";
import { FiSend } from "react-icons/fi";
import { BsMailbox2 } from "react-icons/bs";
import {
    Box,
    Heading,
    FormControl,
    FormErrorMessage,
    Checkbox,
    Input,
    HStack,
    Button,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "@inertiajs/react";

const SubscriptionCard = ({
    children,
    showIcon = true,
    showChildren = false,
    showCheckbox = false,
    fontSize = { base: "lg", lg: "xl" },
    headingText = "Subscribe to our Newsletter",
    consentText = "I agree receiving emails from SAWTEE",
    ...rest
}) => {
    const color = useColorModeValue(
        "var(--color-dark)",
        "var(--color-grey-lighter)"
    );
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });
    const toast = useToast();
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("subscription.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    position: "top-right",
                    title: "Please verify subscription.",
                    description: `Please check your email "${data.email}" to verify your subscription.`,
                    status: "success",
                    duration: null,
                    isClosable: true,
                });
                reset("email");
            },
            onError: () => {
                toast({
                    position: "top-right",
                    title: "Something went wrong.",
                    description: `Error: ${errors.email}`,
                    status: "error",
                    duration: null,
                    isClosable: true,
                });
                reset("email");
            },
        });
    };

    return (
        <SubscriptionBox
            display="flex"
            flexDir={"column"}
            w="full"
            gap="4"
            pos={"relative"}
            rounded="xl"
            textAlign="center"
            color={useColorModeValue("gray.700", "whiteAlpha.700")}
            {...rest}
        >
            {showIcon && (
                <Box display={"flex"} justifyContent="center">
                    <BsMailbox2 size={"90px"} fill={color} />
                </Box>
            )}
            <Heading
                as="h4"
                fontSize={fontSize}
                textTransform="uppercase"
                color={color}
            >
                {headingText}
            </Heading>
            {showCheckbox && (
                <FormControl
                    fontSize={["xs"]}
                    textAlign="center"
                    fontStyle="italic"
                    mb={2}
                    isRequired
                >
                    <Checkbox
                        defaultChecked
                        colorScheme="blue"
                        size="sm"
                        spacing={4}
                    >
                        {consentText}
                    </Checkbox>
                </FormControl>
            )}
            {showChildren && <Box>{children}</Box>}

            <HStack
                as={"form"}
                onSubmit={handleSubmit}
                className="sidebar-form"
                margin={"0 auto"}
                w="full"
                alignItems={"center"}
                pos={"relative"}
            >
                <FormControl isInvalid={errors.email} isRequired>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email address"
                        color={useColorModeValue(
                            "var(--color-grey-darker)",
                            "var(--color-grey-lighter)"
                        )}
                        onChange={(e) => setData("email", e.target.value)}
                        focusBorderColor="blackAlpha.300"
                    />
                    {errors.email && (
                        <FormErrorMessage mt={2}>
                            {errors.email}
                        </FormErrorMessage>
                    )}
                </FormControl>
                <Button
                    type="submit"
                    size="sm"
                    isLoading={processing}
                    variant="solid"
                    bg={useColorModeValue(
                        "var(--color-dark)",
                        "var(--color-grey)"
                    )}
                    _hover={{
                        bg: useColorModeValue(
                            "var(--color-darker)",
                            "var(--color-grey-light)"
                        ),
                    }}
                    color={"white"}
                >
                    <FiSend />
                </Button>
            </HStack>
        </SubscriptionBox>
    );
};

export default SubscriptionCard;

const SubscriptionBox = styled(Box)`
    & input[type="email"] {
        flex: 1 0 auto;
        height: 45px;
        border: 1px solid var(--color-grey);
        border-radius: 10px;
    }

    & button[type="submit"] {
        position: absolute;
        right: 0;
        height: 43px;
        min-width: 60px;
        z-index: 100;
        border-radius: 0 10px 10px 0;
    }
`;
