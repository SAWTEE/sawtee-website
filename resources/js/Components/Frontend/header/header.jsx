import { Box, Collapse, Flex, IconButton, Image, Show, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import MobileMenu from '../mobileMenu';

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Link } from '@inertiajs/react';
import { SearchButton, SearchForm, SearchModal } from '../search';
import DesktopNavigation from './desktopNav';
import ThemeToggle from './themeToggle';

const SiteHeader = props => (
  <Box
    as="header"
    transition="transform ease .25s"
    width="100%"
    pos="sticky"
    top="0"
    left="0"
    bg={useColorModeValue('var(--color-bg)', 'var(--color-darker)')}
    zIndex="90"
    boxShadow="md"
    justifyContent="space-between"
    {...props}
  />
);

const SiteHeaderInner = props => (
  <Flex
    width={{ base: 'auto', sm: '92%' }}
    mx="auto"
    minH={'5rem'}
    py={{ base: 2 }}
    px={{ base: 4 }}
    borderBottom={1}
    borderStyle={'solid'}
    align="center"
    justify={'space-between'}
    borderColor={useColorModeValue('gray.200', 'gray.900')}
    {...props}
  />
);

const Logo = ({ text = 'SAWTEE', src }) => {
  if (src) {
    return <Image src={src} alt="Logo Image" w="120px" />;
  } else {
    return (
      <Text
        textAlign={useBreakpointValue({
          base: 'center',
          md: 'left',
        })}
        fontFamily={'heading'}
        textTransform="uppercase"
        color={useColorModeValue('primary.700', 'primary.300')}
      >
        {text}
      </Text>
    );
  }
};

const SiteLogo = ({ src, established }) => {
  // check if the logo is a url,
  // we assume, if it's a url, it points to an image, else it's a text
  return (
    <Box display="block" flexShrink="0" textAlign="center">
      <Link href="/" aria-label="logo">
        <Logo src={src} />
      </Link>
      {established && (
        <Text fontSize={'.65rem'} fontWeight={'semibold'}>
          Estd: {established}
        </Text>
      )}
    </Box>
  );
};

const Header = ({
  menu = null,
  mobileMenu = null,
  socialLinks = null,
  showSocialLinks = false,
  children,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const searchModal = useDisclosure();
  const [posts, setPosts] = React.useState(null);
  const [query, setQuery] = React.useState(null);
  return (
    <SiteHeader {...props}>
      <SiteHeaderInner>
        <Flex flex={{ base: 1 }} align="center" justify={'space-between'}>
          <Show below="lg">
            <Flex ml={{ base: -2 }} align="center">
              <IconButton
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
              />
            </Flex>
          </Show>
          <Flex justify="center">
            <SiteLogo src={'/assets/logo-sawtee.svg'} established={null} />
          </Flex>
          <Show above="lg">
            <Flex justify="center">
              <DesktopNavigation menu={menu} />
            </Flex>
          </Show>
          <Box as="div" display={'flex'}>
            <ThemeToggle />
            <SearchButton onClick={searchModal.onOpen} />
          </Box>
          <SearchModal
            isOpen={searchModal.isOpen}
            onClose={() => {
              setPosts(null);
              searchModal.onClose();
            }}
            posts={posts}
            query={query}
          >
            <SearchForm setPosts={setPosts} setQuery={setQuery} />
          </SearchModal>
        </Flex>
      </SiteHeaderInner>
      <Collapse in={isOpen} animateOpacity transition={{ enter: { duration: 0.5 } }} style={{ overflow: 'scroll' }}>
        <MobileMenu menu={mobileMenu} socialLinks={socialLinks} showSocialLinks={true} />
      </Collapse>
    </SiteHeader>
  );
};

export default Header;
