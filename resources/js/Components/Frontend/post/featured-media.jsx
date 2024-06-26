import { Box, Image } from '@chakra-ui/react';

const FeaturedMedia = ({ src, srcSet, alt, objectFit, rounded, media, ...rest }) => {
	return (
		<Box as="picture" rounded={rounded ? rounded : 'none'} {...rest}>
			<Image
				boxSize="100%"
				aspectRatio={16 / 9}
				maxH="450px"
				objectFit={objectFit ? objectFit : 'cover'}
				src={src}
				srcSet={srcSet}
				borderRadius={rounded ? rounded : 'none'}
				sizes="(min-width: 1200px) 50vw,100vw"
				alt={alt || 'Hero Image'}
				loading="lazy"
			/>
		</Box>
	);
};

export default FeaturedMedia;
