import { Box, Heading, List } from "@chakra-ui/react";
import React from "react";

export default function SimpleList({ heading, children, ...rest }) {
    return (
        <Box px={6} {...rest} borderLeft={"2px solid"} borderColor={"gray.400"}>
            {heading && (
                <Heading
                    as="h3"
                    fontSize={"md"}
                    textTransform="uppercase"
                    mb="1rem"
                >
                    {heading}
                </Heading>
            )}
            <List as="ul">{children}</List>
        </Box>
    );
}
