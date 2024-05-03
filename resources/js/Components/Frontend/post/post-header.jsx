import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import PostCategories from "./post-categories";

const PostHeader = ({
    heading,
    categories = null,
    description,
    color,
    ...rest
}) => (
    <Box className="post-header" textAlign="center" {...rest}>
        {categories && (
            <PostCategories
                colorScheme="accent"
                category={categories}
                justifyContent="center"
                size={"xs"}
            />
        )}
        <Heading
            as="h1"
            fontWeight="bold"
            fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
            color={color}
            mt="10px"
            mb={{ base: "20px", lg: "32px" }}
            textTransform="capitalize"
            dangerouslySetInnerHTML={{ __html: heading }}
        />

        {/* {description && <Text>{description}</Text>} */}
    </Box>
);

export default PostHeader;
