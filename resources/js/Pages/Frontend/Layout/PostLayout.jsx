import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { LightPatternBox } from "@/Components/Frontend/styles/pattern-box";
import PostHeader from "@/Components/Frontend/post/post-header";
import Section from "@/Components/Frontend/styles/section";
import FeaturedMedia from "@/Components/Frontend/post/featured-media";
import { Content } from "@/Components/Frontend/index";
import PostCategories from "@/Components/Frontend/post/post-categories";
import SocialShare from "@/Components/Frontend/SocialShare";
import readingDuration from "reading-duration";
import PostMeta from "@/Components/Frontend/post/post-meta";

const PostLayout = ({
    children,
    showPattern,
    isProgramPost,
    isNewsletter,
    post,
}) => {
    const postHeaderColor = useColorModeValue("gray.600", "whiteAlpha.600");
    const featured_media = post.media.filter(
        (m) => m.collection_name === "post-featured-image"
    )[0];
    // const srcSet = Object.values(
    //     featured_media.responsive_images.responsive.urls
    // );

    const readingTime = readingDuration(post.content, {
        emoji: "stopwatch",
        wordsPerMinute: 225,
    });

    const shareUrl = isProgramPost
        ? `/programme/${post.category.slug}/${post.slug}`
        : `/${post.category.slug}/${post.slug}`;

    return (
        <LightPatternBox showPattern={showPattern} pt="10px" pb={"40px"}>
            <Box pb="2" maxW="5xl" mx="auto">
                <PostHeader
                    mt={"20px"}
                    px={{ base: "32px", md: "3rem" }}
                    color={postHeaderColor}
                    categories={post.category}
                    heading={post.title}
                />
            </Box>

            {/* <PostProgressBar value={scroll} /> */}

            {/* Look at the settings to see if we should include the featured image */}
            <Box maxW={isNewsletter ? "full" : "4xl"} mx="auto">
                {!isProgramPost && featured_media && (
                    <FeaturedMedia
                        src={featured_media.original_url}
                        rounded={"xl"}
                        // srcSet={srcSet}
                    />
                )}

                <PostMeta
                    author={post.author}
                    date={post.published_at}
                    readingTime={readingTime}
                />

                <Content
                    as={Section}
                    px={{ base: "1rem", md: "2rem" }}
                    size={isNewsletter ? "full" : "lg"}
                    pb="50px"
                    className="post-content"
                >
                    {children}
                    <SocialShare url={shareUrl} />
                </Content>
            </Box>
        </LightPatternBox>
    );
};

export default PostLayout;
